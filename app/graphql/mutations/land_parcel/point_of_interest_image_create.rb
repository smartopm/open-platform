# frozen_string_literal: true

module Mutations
  module LandParcel
    # Upload Photo for a POI
    class PointOfInterestImageCreate < BaseMutation
      argument :id, ID, required: true
      argument :image_blob_id, String, required: true

      field :land_parcel, Types::LandParcelType, null: true

      def resolve(vals)
        land_parcel = context[:site_community]
                      .land_parcels
                      .excluding_general
                      .where(parcel_type: 'poi')
                      .find_by(id: vals[:id])
        raise_land_parcel_not_found_error(land_parcel)

        attach_image(land_parcel, vals)

        return { land_parcel: land_parcel } if land_parcel.images.attached?

        raise GraphQL::ExecutionError, land_parcel.errors.full_messages
      end

      def attach_image(land_parcel, vals)
        land_parcel.images.attach(vals[:image_blob_id]) if vals[:image_blob_id]
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        if permitted?(module: :land_parcel, permission: :can_create_point_of_interest_image)
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if land parcel does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_land_parcel_not_found_error(land_parcel)
        return if land_parcel

        raise GraphQL::ExecutionError, I18n.t('errors.land_parcel.not_found')
      end
    end
  end
end
