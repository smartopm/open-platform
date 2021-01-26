# frozen_string_literal: true

module Types
  # Wallet  Type
  class WalletType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :currency, String, null: false
    field :balance, Float, null: false
    field :pending_balance, Float, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
