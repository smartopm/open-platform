# frozen_string_literal: true

module Types
  # PendingInvoiceType
  class PendingInvoiceType < Types::BaseObject
    field :id, ID, null: false
    field :status, String, null: true
    field :amount, Float, null: true
    field :pending_amount, Float, null: true
    field :invoice_number, Integer, null: true
    field :balance, Float, null: true
    field :community, Types::CommunityType, null: false
    field :due_date, GraphQL::Types::ISO8601DateTime, null: true
    field :land_parcel, Types::LandParcelType, null: false
    field :user, Types::UserType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false

    def balance
      object['balance']
    end
  end
end
