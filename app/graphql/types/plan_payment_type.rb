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
  end
end
