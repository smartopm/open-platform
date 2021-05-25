# frozen_string_literal: true

module Types
  # Wallet Transaction Type
  class TransactionReceiptType < Types::BaseObject
    field :id, ID, null: false
    field :source, String, null: false
    field :amount, Float, null: false
    field :status, String, null: false
    field :bank_name, String, null: true
    field :cheque_number, String, null: true
    field :user, Types::UserType, null: false
    field :community, Types::CommunityType, null: false
    field :plan_payments, [Types::PlanPaymentType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false

    # Returns paid payment entries of deposit.
    #
    # @return [Array] PlanPayment
    def plan_payments
      object.plan_payments.not_cancelled
    end
  end
end
