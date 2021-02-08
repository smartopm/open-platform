# frozen_string_literal: true

module Mutations
  module Payment
    # Create a new PaymentPlan for a land
    class PaymentPlanCreate < BaseMutation
      argument :land_parcel_id, ID, required: true
      argument :user_id, ID, required: true
      argument :status, Integer, required: true
      argument :plan_type, String, required: true
      argument :percentage, String, required: true
      argument :start_date, GraphQL::Types::ISO8601DateTime, required: true

      field :payment_plan, Types::PaymentPlanType, null: true

      def resolve(vals)
        user = context[:site_community].users.find(vals[:user_id])
        raise GraphQL::ExecutionError, 'User not found' if user.nil?

        payment_plan = user.payment_plans.create!(vals.except(:user_id))
        return { payment_plan: payment_plan } if payment_plan.persisted?

        raise GraphQL::ExecutionError, payment_plan.errors.full_messages
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end
