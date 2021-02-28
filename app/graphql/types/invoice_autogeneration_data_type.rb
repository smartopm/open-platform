# frozen_string_literal: true

module Types
  # InvoiceAutogenerationDataType
  class InvoiceAutogenerationDataType < Types::BaseObject
    field :number_of_invoices, Integer, null: true
    field :total_amount, Float, null: true
  end
end
