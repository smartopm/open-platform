# frozen_string_literal: true

module Types
  # InvoiceTransactionType
  class InvoiceTransactionType < Types::BaseObject
    field :payments, [Types::PaymentType], null: false
    field :invoices, [Types::InvoiceType], null: false
    field :deposits, [Types::WalletTransactionType], null: true
    field :payment_plans, [Types::PaymentPlanType], null: false
  end
end
