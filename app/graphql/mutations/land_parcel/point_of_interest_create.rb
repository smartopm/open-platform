# frozen_string_literal: true

require 'parcel_indexer'

module Mutations
  module LandParcel
    # Create a new Point of Interest
    class PointOfInterestCreate < BaseMutation
      argument :long_x, Float, required: true
      argument :lat_y, Float, required: true
      argument :geom, String, required: true

      field :land_parcel, Types::LandParcelType, null: true

      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        parcel_number = ParcelIndexer.generate_parcel_no(parcel_type: 'poi')

        ActiveRecord::Base.transaction do
          land_parcel = context[:site_community].land_parcels.create!(
            parcel_number: parcel_number,
            parcel_type: 'poi',
            object_type: 'poi',
            long_x: vals[:long_x],
            lat_y: vals[:lat_y],
            geom: vals[:geom],
          )

          { land_parcel: land_parcel }
        end
      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError, e.message
      end

      # rubocop:enable Metrics/MethodLength
      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :land_parcel, permission: :can_create_point_of_interest)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
