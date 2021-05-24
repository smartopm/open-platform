# frozen_string_literal: true

# Payment queries
module Types::Queries::PaymentPlan
  extend ActiveSupport::Concern
  included do
    field :user_plans_with_payments, [Types::PaymentPlanType], null: true do
      description 'return payment plans for user'
      argument :user_id, GraphQL::Types::ID, required: true
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  # Returns list of user's all payment plans
  #
  # @param user_id [String]
  # @param offset [Integer]
  # @param limit [Integer]
  #
  # @return [Array<PaymentPlan>]
  def user_plans_with_payments(user_id: nil, offset: 0, limit: 10)
    user = verified_user(user_id)
    payment_plans = user.payment_plans.includes(:plan_payments).where.not(pending_balance: 0)

    if context[:current_user].admin?
      payment_plans.order(created_at: :desc).offset(offset).limit(limit)
    else
      payment_plans.where.not(plan_payments: { status: :cancelled }).order(
        created_at:
        :desc,
      ).offset(offset).limit(limit)
    end
  end
end
