# frozen_string_literal: true

module Mutations
  module Payment
    # Cancel Plan Payment
    class PlanPaymentCancel < BaseMutation
      argument :plan_payment_id, ID, required: true

      field :cancelled_plan_payment, Types::PlanPaymentType, null: false

      def resolve(plan_payment_id:)
        plan_payment = context[:site_community].plan_payments.find_by(id: plan_payment_id)
        raise_error_plan_payment_not_found(plan_payment)

        plan_payment.cancelled!
        amount = plan_payment.amount
        plan_payment.payment_plan.update_pending_balance(amount, :revert)
        { cancelled_plan_payment: plan_payment.reload }
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      # Raises error if plan payment is not present.
      def raise_error_plan_payment_not_found(plan_payment)
        return if plan_payment.present?

        raise GraphQL::ExecutionError, I18n.t('errors.plan_payment.not_found')
      end
    end
  end
end
