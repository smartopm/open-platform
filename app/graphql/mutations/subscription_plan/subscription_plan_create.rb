# frozen_string_literal: true

module Mutations
  module SubscriptionPlan
    # Create subscription plan
    class SubscriptionPlanCreate < BaseMutation
      argument :plan_type, String, required: true
      argument :start_date, String, required: true
      argument :end_date, String, required: true
      argument :amount, Float, required: true
      argument :status, String, required: false

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(vals)
        subscription = context[:site_community].subscription_plans.create(vals)

        unless subscription.persisted?
          raise GraphQL::ExecutionError, subscription.errors.full_messages
        end

        { success: true }
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(
          module: :subscription_plan,
          permission: :can_create_subscription_plan,
        )

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
