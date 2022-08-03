# frozen_string_literal: true

module Mutations
  module Payment
    # Cancel Plan Payment
    class PlanPaymentCancel < BaseMutation
      argument :id, ID, required: true

      field :cancelled_plan_payment, Types::PlanPaymentType, null: false

      def resolve(id:)
        payment = context[:site_community].plan_payments.find_by(id: id)
        raise_error_plan_payment_not_found(payment)

        raise GraphQL::ExecutionError, payment.errors.full_messages unless payment.cancelled!

        payment.payment_plan.update_pending_balance(payment.amount, :revert)
        { cancelled_plan_payment: payment.reload }
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :plan_payment, permission: :can_cancel_plan_payment)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      # Raises error if plan payment is not present.
      def raise_error_plan_payment_not_found(payment)
        return if payment.present?

        raise GraphQL::ExecutionError, I18n.t('errors.plan_payment.not_found')
      end
    end
  end
end
