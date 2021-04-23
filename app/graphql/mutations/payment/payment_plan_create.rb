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
      argument :start_date, String, required: true
      argument :monthly_amount, Float, required: true
      argument :total_amount, Float, required: true
      argument :duration_in_month, Integer, required: true
      argument :payment_day, Integer, required: false

      field :payment_plan, Types::PaymentPlanType, null: true

      def resolve(vals)
        user = context[:site_community].users.find(vals[:user_id])
        raise GraphQL::ExecutionError, 'User not found' if user.nil?

        payment_plan = user.payment_plans.create!(vals.except(:user_id))
        return { payment_plan: payment_plan } if payment_plan.persisted?

        raise GraphQL::ExecutionError, payment_plan.errors.full_messages
      rescue ActiveRecord::RecordNotUnique
        raise GraphQL::ExecutionError, 'Payment Plan for this landparcel already exist'
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end
