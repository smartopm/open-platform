# frozen_string_literal: true

module Types
  # Wallet Transaction Type
  class TransactionType < Types::BaseObject
    field :id, ID, null: false
    field :source, String, null: false
    field :amount, Float, null: false
    field :status, String, null: false
    field :bank_name, String, null: true
    field :cheque_number, String, null: true
    field :receipt_number, String, null: true
    field :transaction_number, String, null: true
    field :user, Types::UserType, null: false
    field :depositor, Types::UserType, null: true
    field :community, Types::CommunityType, null: false
    field :plan_payments, [Types::PlanPaymentType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :originally_created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
