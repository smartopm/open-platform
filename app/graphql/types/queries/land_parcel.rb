# frozen_string_literal: true

# showroom queries
module Types::Queries::LandParcel
  extend ActiveSupport::Concern

  included do
    # Get land parcel entries
    field :fetch_land_parcel, [Types::ParcelFieldType], null: true do
      description 'Get all land parcel entries'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def fetch_land_parcel(offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

    context[:site_community].land_parcels.limit(limit).offset(offset)
  end
end
