# frozen_string_literal: true

module Types
  # Valuation Type
  class ValuationType < Types::BaseObject
    field :id, ID, null: false
    field :amount, Float, null: false
    field :start_date, Types::Scalar::DateType, null: false
    field :created_at, Types::Scalar::DateType, null: false
  end
end
