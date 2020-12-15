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

    # Get land parcel details that belongs to a user
    field :user_land_parcel, [Types::ParcelFieldType], null: true do
      description 'Get a user land parcel details'
      argument :user_id, GraphQL::Types::ID, required: true
    end
  end

  def fetch_land_parcel(offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

    context[:site_community].land_parcels.limit(limit).offset(offset)
  end

  def user_land_parcel(user_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:site_community].users.find(user_id)&.land_parcels 
  end 
end
