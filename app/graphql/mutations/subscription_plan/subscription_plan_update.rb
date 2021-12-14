# frozen_string_literal: true

module Mutations
  module SubscriptionPlan
    # Update subscription plan
    class SubscriptionPlanUpdate < BaseMutation
      argument :id, ID, required: true
      argument :plan_type, String, required: true
      argument :start_date, String, required: true
      argument :end_date, String, required: true
      argument :amount, Float, required: true
      argument :status, String, required: false

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(vals)
        subscription = context[:site_community].subscription_plans.find_by(id: vals[:id])
        raise_subscription_not_found_error(subscription)

        return { success: true } if subscription.update(vals)

        raise GraphQL::ExecutionError, subscription.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(
          module: :subscription_plan,
          permission: :can_update_subscription_plan,
        )

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      # Raises GraphQL execution error if subscription does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_subscription_not_found_error(subscription)
        return if subscription

        raise GraphQL::ExecutionError, I18n.t('errors.subscription.not_found')
      end
    end
  end
end
