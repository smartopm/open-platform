# frozen_string_literal: true

module Mutations
  module Payment
    # Cancel Payment Plan
    class PaymentPlanCancel < BaseMutation
      argument :id, ID, required: true
      argument :user_id, ID, required: true

      field :payment_plan, Types::PaymentPlanType, null: true

      def resolve(vals)
        user = context[:site_community].users.find(vals[:user_id])
        raise_user_not_found_error(user)

        payment_plan = user.payment_plans.find_by(id: vals[:id])
        raise_payment_plan_not_found_error(payment_plan)

        return { payment_plan: payment_plan } if payment_plan.cancel!

        raise GraphQL::ExecutionError, payment_plan.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      # Raises GraphQL execution error if user does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_user_not_found_error(user)
        return if user

        raise GraphQL::ExecutionError, I18n.t('errors.user.not_found')
      end

      # Raises GraphQL execution error if user does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_plan_not_found_error(payment_plan)
        return if payment_plan

        raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.not_found')
      end

      # Raises error if plan payment is not present.
      def raise_error_plan_payment_not_found(payment)
        return if payment.present?

        raise GraphQL::ExecutionError, I18n.t('errors.plan_payment.not_found')
      end
    end
  end
end
