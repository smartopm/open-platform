# frozen_string_literal: true

module Types
  # Wallet  Type
  class WalletType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :currency, String, null: false
    field :balance, Float, null: false
    field :pending_balance, Float, null: true
    field :created_at, Types::Scalar::DateType, null: false
    field :updated_at, Types::Scalar::DateType, null: false
  end
end
