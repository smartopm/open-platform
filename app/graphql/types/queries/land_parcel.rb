# frozen_string_literal: true

# showroom queries
# rubocop:disable Metrics/ModuleLength
module Types::Queries::LandParcel
  extend ActiveSupport::Concern

  # rubocop:disable Metrics/BlockLength
  included do
    # Get land parcel entries
    field :fetch_land_parcel, [Types::LandParcelType], null: true do
      description 'Get all land parcel entries'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
      argument :query, String, required: false
    end

    # Get land parcel details that belongs to a user
    field :user_land_parcels, [Types::LandParcelType], null: true do
      description 'Get a user land parcel details'
      argument :user_id, GraphQL::Types::ID, required: true
    end

    # Get payment plan and land parcel details that belongs to a user
    field :user_land_parcel_with_plan, [Types::PaymentPlanType], null: true do
      description 'Get user payment plans'
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

    field :fetch_house, [Types::LandParcelType], null: true do
      description 'Get all land parcel entries'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end

    field :house_geo_data, [Types::LandParcelGeoDataType], null: true do
      description 'Get all House Geo Data'
    end
  end
  # rubocop:enable Metrics/BlockLength

  def fetch_land_parcel(query: nil, offset: 0, limit: 100)
    unless context[:current_user]&.admin?
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].land_parcels
                            .search(query)
                            .includes(accounts: :user, payment_plans: %i[user plan_payments])
                            .with_attached_images
                            .where(object_type: 'land')
                            .limit(limit).offset(offset)
  end

  def user_land_parcels(user_id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    context[:site_community].users.find_by(id: user_id).land_parcels.includes(:accounts)
  end

  def user_land_parcel_with_plan(user_id:)
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    user = context[:site_community].users.find_by(id: user_id)
    user.payment_plans.includes(:land_parcel).where.not(pending_balance: 0)
  end

  def land_parcel(id:)
    unless context[:current_user].admin?
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    parcel = context[:site_community].land_parcels
                                     .includes(accounts: :user, payment_plans:
                                      %i[user plan_payments])
                                     .with_attached_images
                                     .find_by(id: id)
    raise GraphQL::ExecutionError, 'Record not found' if parcel.nil?

    parcel
  end

  def land_parcel_geo_data
    raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') if context[:current_user].blank?

    properties = context[:site_community].land_parcels
                                         .eager_load(:valuations, :accounts)
                                         .with_attached_images

    properties.map { |p| geo_data(p, properties) }
  end

  def fetch_house(offset: 0, limit: 100)
    unless context[:current_user]&.admin?
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].land_parcels
                            .where(object_type: 'house')
                            .includes(accounts: :user, payment_plans: %i[user plan_payments])
                            .with_attached_images
                            .limit(limit).offset(offset)
  end

  # rubocop:disable Metrics/MethodLength
  def geo_data(parcel, properties)
    geom_fields = geom_fields(parcel, properties)

    { id: parcel[:id],
      parcel_type: parcel[:parcel_type],
      parcel_number: parcel[:parcel_number],
      lat_y: geom_fields[:lat_y],
      long_x: geom_fields[:long_x],
      geom: geom_fields[:geom],
      status: parcel[:status],
      object_type: parcel[:object_type],
      plot_sold: parcel.accounts.present?,
      accounts: parcel.accounts,
      valuations: parcel.valuations }
  end
  # rubocop:enable Metrics/MethodLength

  def geom_fields(parcel, properties)
    if parcel[:object_type] == 'house' && parcel[:house_land_parcel_id].present?
      # TODO: Victor we need a better assocaiation between land parcels and houses
      house_land_parcel = properties.filter { |p| p[:id] == parcel[:house_land_parcel_id] }.first

      return { geom: house_land_parcel[:geom],
               long_x: house_land_parcel[:long_x],
               lat_y: house_land_parcel[:lat_y] }
    end

    { geom: parcel[:geom], long_x: parcel[:long_x], lat_y: parcel[:lat_y] }
  end
end
# rubocop:enable Metrics/ModuleLength
