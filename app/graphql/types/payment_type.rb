# frozen_string_literal: true

module Types
  # PaymentType
  class PaymentType < Types::BaseObject
    field :id, ID, null: false
    field :payment_status, String, null: true
    field :amount, Float, null: true
    field :payment_type, String, null: true
    field :bank_name, String, null: true
    field :cheque_number, String, null: true
    field :invoices, [Types::InvoiceType], null: false
    field :user, Types::UserType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
