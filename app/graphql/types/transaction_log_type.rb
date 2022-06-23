# frozen_string_literal: true

module Types
  # Transaction log Type
  class TransactionLogType < Types::BaseObject
    field :id, ID, null: false
    field :paid_amount, Float, null: true
    field :currency, String, null: true
    field :invoice_number, String, null: true
    field :transaction_ref, String, null: true
    field :transaction_id, String, null: true
    field :amount, Float, null: true
    field :description, String, null: true
    field :account_name, String, null: true
    field :integration_type, String, null: true
    field :user, Types::UserType, null: true
  end
end
