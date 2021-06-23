# frozen_string_literal: true

module Types
  # List of payment plan detail fields.
  class PlanStatementType < Types::BaseObject
    field :receipt_number, String, null: true
    field :payment_date, GraphQL::Types::ISO8601DateTime, null: true
    field :amount_paid, Float, null: false
    field :installment_amount, Float, null: true
    field :settled_installments, Integer, null: false
    field :debit_amount, Float, null: false
    field :unallocated_amount, Float, null: false
  end
end
