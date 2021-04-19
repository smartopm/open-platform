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
    field :receipt_number, String, null: true
    field :transaction_number, String, null: true
    field :current_wallet_balance, Float, null: true
    field :user, Types::UserType, null: false
    field :depositor, Types::UserType, null: true
    field :community, Types::CommunityType, null: false
    field :payment_plan, Types::PaymentPlanType, null: true
    field :invoices, [Types::InvoiceType], null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false

    def invoices
      ::PaymentInvoice.where(wallet_transaction_id: object.id).map(&:invoice)
    end
  end
end
