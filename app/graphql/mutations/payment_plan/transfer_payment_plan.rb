# frozen_string_literal: true

module Mutations
  module PaymentPlan
    # Transfers PaymentPlan to other LandParcel.
    class TransferPaymentPlan < BaseMutation
      argument :source_plan_id, ID, required: true
      argument :destination_plan_id, ID, required: true

      field :payment_plan, Types::PaymentPlanType, null: true

      def resolve(vals)
        source_payment_plan = Properties::PaymentPlan.find_by(id: vals[:source_plan_id])
        destination_payment_plan = Properties::PaymentPlan.find_by(id: vals[:destination_plan_id])
        raise_payment_plan_related_error(source_payment_plan)
        raise_payment_plan_related_error(destination_payment_plan)

        ActiveRecord::Base.transaction do
          destination_payment_plan.transfer_payments(source_payment_plan)
          return { payment_plan: destination_payment_plan.reload } if source_payment_plan.cancel!

          raise GraphQL::ExecutionError, destination_payment_plan.errors.full_messages
        end
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # rubocop:disable Style/GuardClause
      # Raises GraphQL execution payment plan does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_plan_related_error(payment_plan)
        if payment_plan.blank?
          raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.not_found')
        elsif payment_plan.cancelled?
          raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.transfer_can_not_be_processed')
        end
      end
      # rubocop:enable Style/GuardClause
    end
  end
end
