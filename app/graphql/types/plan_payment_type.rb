# frozen_string_literal: true

module Types
  # Wallet Transaction Type
  class PlanPaymentType < Types::BaseObject
    field :id, ID, null: false
    field :amount, Float, null: false
    field :status, String, null: false
    field :user_transaction, Types::TransactionType,
          null: false,
          resolve: Resolvers::BatchResolver.load(:user_transaction)
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :community, Types::CommunityType, null: false,
                                            resolve: Resolvers::BatchResolver.load(:community)
    field :payment_plan, Types::PaymentPlanType,
          null: true,
          resolve: Resolvers::BatchResolver.load(:payment_plan)
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :receipt_number, String, null: true
    field :manual_receipt_number, String, null: true
    field :automated_receipt_number, String, null: true
    field :current_plot_pending_balance, Float, null: true

    # Returns payment plan's current pending balance(balance remaining till payment date).
    #
    # @return [Float]
    def current_plot_pending_balance
      batch_load(object, :payment_plan).then do |plan|
        total_balance = plan.installment_amount * plan.duration
        plan_payments = plan.plan_payments.not_cancelled.created_at_lteq(object.created_at)
        total_balance - plan_payments.sum(:amount)
      end
    end
  end
end
