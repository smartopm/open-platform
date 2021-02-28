# frozen_string_literal: true

module Types
  # InvoiceAccountingStatType
  class InvoiceAccountingStatType < Types::BaseObject
    field :no_of_days, String, null: true
    field :no_of_invoices, Integer, null: true
  end
end
