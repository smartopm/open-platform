# frozen_string_literal: true

module Types
  # PaymentSummaryType
  class PaymentSummaryType < Types::BaseObject
    field :today, Float, null: true
    field :one_week, Float, null: true
    field :one_month, Float, null: true
    field :over_one_month, Float, null: true
  end
end