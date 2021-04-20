# frozen_string_literal: true

module Types
  # InvoiceSummaryType
  class InvoiceSummaryType < Types::BaseObject
    field :today, Integer, null: true
    field :one_week, Integer, null: true
    field :one_month, Integer, null: true
    field :over_one_month, Integer, null: true
  end
end