# frozen_string_literal: true

module Types
  # Land Parcel GeoData Type
  class LandParcelGeoDataType < Types::BaseObject
    field :id, ID, null: false
    field :parcel_number, String, null: false
    field :parcel_type, String, null: true
    field :long_x, Float, null: true
    field :lat_y, Float, null: true
    field :geom, GraphQL::Types::JSON, null: true
    field :status, String, null: true
    field :object_type, String, null: true
    field :plot_sold, Boolean, null: true
    field :valuations, [Types::ValuationType], null: true
    field :accounts, [Types::AccountType], null: true
  end
end
