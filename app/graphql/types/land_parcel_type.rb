# frozen_string_literal: true

module Types
  # Message Type
  class LandParcelType < Types::BaseObject
    field :id, ID, null: false
    field :community, Types::CommunityType, null: false
    field :parcel_number, String, null: false
    field :address1, String, null: true
    field :address2, String, null: true
    field :city, String, null: true
    field :postal_code, String, null: true
    field :state_province, String, null: true
    field :country, String, null: true
    field :parcel_type, String, null: true
    field :long_x, Float, null: true
    field :lat_y, Float, null: true
    field :geom, GraphQL::Types::JSON, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :read_at, GraphQL::Types::ISO8601DateTime, null: true
    field :valuations, [Types::ValuationType], null: false
    field :accounts, [Types::AccountType], null: false
  end
end
