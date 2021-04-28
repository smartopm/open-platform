# frozen_string_literal: true

module Types
  # BalanceType
  class BalanceType < Types::BaseObject
    field :balance, Float, null: true
    field :pending_balance, Float, null: true

    # Returns user wallet balance.
    def pending_balance
      -object[:pending_balance]
    end
  end
end
