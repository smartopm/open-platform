# frozen_string_literal: true

module Types
  # Wallet Transaction Type
  class PlanPaymentType < Types::BaseObject
    field :id, ID, null: false
    field :amount, Float, null: false
    field :status, String, null: false
    field :user_transaction, Types::TransactionType, null: false
    field :user, Types::UserType, null: false
    field :community, Types::CommunityType, null: false
    field :payment_plan, Types::PaymentPlanType, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :receipt_number, String, null: true
    field :current_plot_pending_balance, Float, null: true

    # Returns payment plan's current pending balance(balance remaining till payment date).
    #
    # @return [Float]
    def current_plot_pending_balance
      plan = object.payment_plan
      total_balance = plan.monthly_amount * plan.duration_in_month
      plan_payments = plan.plan_payments.not_cancelled.created_at_lteq(object.created_at)

      total_balance - plan_payments.sum(:amount)
    end
  end
end
