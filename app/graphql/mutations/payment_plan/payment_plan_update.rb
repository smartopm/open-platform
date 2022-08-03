# frozen_string_literal: true

# Defines the mutation to update payment day.
module Mutations
  module PaymentPlan
    # Updates Payment Plan
    class PaymentPlanUpdate < BaseMutation
      argument :plan_id, ID, required: true
      argument :payment_day, Integer, required: false
      argument :renewable, Boolean, required: false

      field :payment_plan, Types::PaymentPlanType, null: true

      def resolve(vals)
        payment_plan = Properties::PaymentPlan.find_by(id: vals[:plan_id])
        raise_payment_plan_not_found_error(payment_plan)

        return { payment_plan: payment_plan } if payment_plan.update(vals.except(:plan_id))

        raise GraphQL::ExecutionError, payment_plan.errors.full_messages&.join(', ')
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :payment_plan, permission: :can_update_payment_plan)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if user does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_plan_not_found_error(payment_plan)
        return if payment_plan

        raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.not_found')
      end
    end
  end
end
