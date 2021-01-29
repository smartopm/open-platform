# frozen_string_literal: true

module Types
  # Wallet Transaction Type
  class WalletTransactionType < Types::BaseObject
    field :id, ID, null: false
    field :source, String, null: false
    field :destination, String, null: false
    field :amount, Float, null: false
    field :status, String, null: false
    field :bank_name, String, null: true
    field :cheque_number, String, null: true
    field :current_wallet_balance, Float, null: true
    field :user, Types::UserType, null: false
  end
end
