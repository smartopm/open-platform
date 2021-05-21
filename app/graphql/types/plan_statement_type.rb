# frozen_string_literal: true

module Types
  # List of payment plan detail fields.
  class PlanStatementType < Types::BaseObject
    field :transaction_number, String, null: true
    field :payment_date, GraphQL::Types::ISO8601DateTime, null: true
    field :due_date, GraphQL::Types::ISO8601DateTime, null: true
    field :amount_paid, Float, null: false
    field :balance, Float, null: false
    field :status, String, null: false
  end
end
