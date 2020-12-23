# frozen_string_literal: true

module Types
    # InvoiceStatType
    class InvoiceStatType < Types::BaseObject
      field :late, Integer, null: true
      field :paid, Integer, null: true
      field :in_progress, Integer, null: true
      field :cancelled, Integer, null: true
    end
end
  