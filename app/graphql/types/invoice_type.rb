# frozen_string_literal: true

module Types
  # InvoiceType
  class InvoiceType < Types::BaseObject
    field :id, ID, null: false
    field :note, String, null: true
    field :status, String, null: true
    field :amount, Integer, null: true
    field :description, String, null: true
    field :community, Types::CommunityType, null: false
    field :land_parcel, Types::LandParcelType, null: false
    field :due_date, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
