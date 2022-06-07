# frozen_string_literal: true

module Mutations
  module LandParcel
    # Create a new Land Parcel
    class PropertyUpdate < BaseMutation
      argument :id, ID, required: true
      argument :parcel_number, String, required: true
      argument :address1, String, required: false
      argument :address2, String, required: false
      argument :city, String, required: false
      argument :postal_code, String, required: false
      argument :state_province, String, required: false
      argument :parcel_type, String, required: false
      argument :country, String, required: false
      argument :long_x, Float, required: false
      argument :lat_y, Float, required: false
      argument :geom, GraphQL::Types::JSON, required: false
      argument :ownership_fields, GraphQL::Types::JSON, required: false
      argument :status, String, required: false
      argument :object_type, String, required: false

      field :land_parcel, Types::LandParcelType, null: true

      # rubocop:disable Metrics/MethodLength
      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        land_parcel = context[:site_community].land_parcels
                                              .excluding_general
                                              .find_by(id: vals[:id])
        raise_land_parcel_not_found_error(land_parcel)

        ActiveRecord::Base.transaction do
          land_parcel.update!(
            vals.except(:ownership_fields),
          )

          land_parcel.land_parcel_accounts.delete_all

          Array.wrap(vals[:ownership_fields]).each do |v|
            land_parcel.accounts.create!(user_id: v['userId'],
                                         full_name: v['name'],
                                         address1: v['address'],
                                         community_id: context[:site_community].id)
          end

          { land_parcel: land_parcel }
        end
      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError, e.message
      end
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/AbcSize

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :land_parcel, permission: :can_update_land_parcel)

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
