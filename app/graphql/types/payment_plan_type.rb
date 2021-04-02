# frozen_string_literal: true

module Types
  # PaymentPlanType
  class PaymentPlanType < Types::BaseObject
    field :id, ID, null: false
    field :status, String, null: true
    field :plan_type, String, null: true
    field :percentage, String, null: true
    field :plot_balance, Integer, null: true
    field :pending_balance, Integer, null: true
    field :land_parcel, Types::LandParcelType, null: false
    field :invoices, [Types::InvoiceType], null: false
    field :start_date, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
