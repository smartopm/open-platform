# frozen_string_literal: true

module Mutations
  module PaymentPlan
    # Allocates general funds to a payment plan
    class AllocateGeneralFunds < BaseMutation
      argument :payment_plan_id, ID, required: true

      field :success, Boolean, null: true

      def resolve(vals)
        payment_plan = Properties::PaymentPlan.find_by(id: vals[:payment_plan_id])
        raise_payment_plan_related_error(payment_plan)

        user = payment_plan.user
        raise_general_funds_related_errors(user)

        ActiveRecord::Base.transaction do
          payment_plan.allocate_general_funds

          { success: true }
        end
      rescue StandardError => e
        raise GraphQL::ExecutionError, e.message
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :payment_plan, permission: :can_allocate_general_funds)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error payment plan does not exist or if the plan is not active
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_plan_related_error(payment_plan)
        message = ''
        if payment_plan.blank?
          message = I18n.t('errors.payment_plan.not_found')
        elsif !payment_plan.active?
          message = I18n.t('errors.payment_plan.cannot_allocate_funds')
        end

        raise GraphQL::ExecutionError, message if message.present?
      end

      # Raises GraphQL execution error if general fund does not exist
      # or it does not have atleast one paid payment
      #
      # @return [GraphQL::ExecutionError]
      def raise_general_funds_related_errors(user)
        general_fund = user.payment_plans.general.first
        return unless general_fund.nil? || !general_fund.plan_payments.exists?(status: :paid)

        raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.general_funds_does_not_exist')
      end
    end
  end
end
