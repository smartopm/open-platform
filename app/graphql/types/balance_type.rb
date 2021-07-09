# frozen_string_literal: true

module Types
  # BalanceType
  class BalanceType < Types::BaseObject
    field :balance, Float, null: true
    field :pending_balance, Float, null: true
    field :total_transactions, Float, null: true
  end
end
