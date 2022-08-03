# frozen_string_literal: true

module Mutations
  module LandParcel
    # Merge land parcel
    class PropertyMerge < BaseMutation
      argument :id, ID, required: true
      argument :parcel_number, String, required: true
      argument :geom, String, required: true

      field :land_parcel, Types::LandParcelType, null: true

      def resolve(vals)
        land_parcel = context[:site_community].land_parcels
                                              .excluding_general
                                              .find_by(id: vals[:id])
        raise_land_parcel_not_found_error(land_parcel)

        ActiveRecord::Base.transaction do
          land_parcel.update!(vals.except(:id))

          { land_parcel: land_parcel }
        end
      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError, e.message
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :land_parcel, permission: :can_merge_land_parcels)

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
