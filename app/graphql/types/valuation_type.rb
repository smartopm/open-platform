# frozen_string_literal: true

module Types
  # Valuation Type
  class ValuationType < Types::BaseObject
    field :id, ID, null: false
    field :amount, Float, null: false
    field :start_date, GraphQL::Types::ISO8601DateTime, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
