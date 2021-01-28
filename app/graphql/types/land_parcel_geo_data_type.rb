# frozen_string_literal: true

module Types
  # Land Parcel GeoData Type
  class LandParcelGeoDataType < Types::BaseObject
    field :parcel_number, String, null: false
    field :parcel_type, String, null: true
    field :long_x, Float, null: true
    field :lat_y, Float, null: true
    field :geom, GraphQL::Types::JSON, null: true
    field :plot_sold, Boolean, null: true
  end
end
