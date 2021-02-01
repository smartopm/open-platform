# frozen_string_literal: true

module Types
  # DepositType
  class DepositType < Types::BaseObject
    field :pending_invoices, [Types::PendingInvoiceType], null: true
    field :transactions, [Types::WalletTransactionType], null: true
  end
end
