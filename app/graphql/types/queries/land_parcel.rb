# frozen_string_literal: true

# showroom queries
module Types::Queries::LandParcel
  extend ActiveSupport::Concern

  included do
    # Get land parcel entries
    field :fetch_land_parcel, [Types::LandParcelType], null: true do
      description 'Get all land parcel entries'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end

    # Get land parcel details that belongs to a user
    field :user_land_parcel, [Types::LandParcelType], null: true do
      description 'Get a user land parcel details'
      argument :user_id, GraphQL::Types::ID, required: true
    end

    # Get a land parcel
    field :land_parcel, Types::LandParcelType, null: true do
      description 'Get a land parcel'
      argument :id, GraphQL::Types::ID, required: true
    end

    field :land_parcel_geo_data, [Types::LandParcelGeoDataType], null: true do
      description 'Get all land parcel Geo Data'
    end

    field :land_parcel_payment_plan, Types::PaymentPlanType, null: true do
      description 'Get payment plan for a land_parcel'
      argument :land_parcel_id, GraphQL::Types::ID, required: true
    end
  end

  def fetch_land_parcel(query: nil, offset: 0, limit: 100)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user]&.admin?

    context[:site_community].land_parcels
                            .where(is_poi: false)
                            .eager_load(:valuations, :accounts)
                            .with_attached_image
                            .search(query)
                            .limit(limit).offset(offset)
  end

  def user_land_parcel(user_id:)
    raise GraphQL::ExecutionError, 'Uneauthorized' if context[:current_user].blank?

    context[:site_community].users.find_by(id: user_id)&.land_parcels
  end

  def land_parcel(id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

    parcel = context[:site_community].land_parcels
                                     .eager_load(:valuations, :accounts)
                                     .with_attached_image
                                     .find_by(id: id)
    raise GraphQL::ExecutionError, 'Record not found' if parcel.nil?

    parcel
  end

  def land_parcel_geo_data
    raise GraphQL::ExecutionError, 'Unauthorized' if context[:current_user].blank?

    context[:site_community].land_parcels.where.not(geom: nil)
                            .eager_load(:valuations, :accounts)
                            .with_attached_image
                            .map { |p| geo_data(p) }
  end

  def land_parcel_payment_plan(land_parcel_id:)
    raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

    parcel = context[:site_community].land_parcels.find_by(id: land_parcel_id)
    raise GraphQL::ExecutionError, 'LandParcel not found' if parcel.nil?

    parcel.payment_plan
  end

  def geo_data(parcel)
    { id: parcel[:id],
      parcel_type: parcel[:parcel_type],
      parcel_number: parcel[:parcel_number],
      lat_y: parcel[:lat_y],
      long_x: parcel[:long_x],
      geom: parcel[:geom],
      is_poi: parcel[:is_poi],
      plot_sold: parcel.accounts.present?,
      accounts: parcel.accounts,
      valuations: parcel.valuations }
  end
end
