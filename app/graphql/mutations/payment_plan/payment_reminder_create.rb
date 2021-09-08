# frozen_string_literal: true

module Mutations
  module PaymentPlan
    # Set payment reminder
    class PaymentReminderCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :payment_plan_id, ID, required: true

      field :message, String, null: false

      def resolve(vals)
        user = context[:site_community].users.find_by(id: vals[:user_id])
        raise_user_not_found_error(user)

        payment_plan = Properties::PaymentPlan.find_by(id: vals[:payment_plan_id])
        raise_plan_not_found_error(payment_plan)

        PaymentReminderJob.perform_later(user, payment_plan)

        # TOODO: Remove
        # rescue StandardError
        #   raise GraphQL::ExecutionError, I18n.t('errors.user.does_not_exists')

        { message: 'Sucess' }
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user].admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if user does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_user_not_found_error(user)
        return if user

        raise GraphQL::ExecutionError, I18n.t('errors.user.does_not_exists')
      end

      # Raises GraphQL execution error if payment plan does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_plan_not_found_error(payment_plan)
        return if payment_plan

        raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.not_found')
      end
    end
  end
end
