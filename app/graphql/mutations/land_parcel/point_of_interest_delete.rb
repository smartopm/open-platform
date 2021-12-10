# frozen_string_literal: true

module Mutations
  module LandParcel
    # Delete an action flow
    class PointOfInterestDelete < BaseMutation
      argument :id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(id:)
        poi_to_delete = context[:site_community].land_parcels.find_by(id: id)
        raise_land_parcel_not_found_error(poi_to_delete)

        return { success: true } if poi_to_delete.update(status: 1)
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :land_parcel, permission: :can_delete_point_of_interest)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if land parcel does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_land_parcel_not_found_error(poi_to_delete)
        return if poi_to_delete

        raise GraphQL::ExecutionError,
              I18n.t('errors.land_parcel.poi_record_not_found')
      end
    end
  end
end
