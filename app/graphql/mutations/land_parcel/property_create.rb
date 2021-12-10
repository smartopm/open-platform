# frozen_string_literal: true

module Mutations
  module LandParcel
    # Create a new Land Parcel
    class PropertyCreate < BaseMutation
      argument :parcel_number, String, required: true
      argument :address1, String, required: false
      argument :address2, String, required: false
      argument :city, String, required: false
      argument :postal_code, String, required: false
      argument :state_province, String, required: false
      argument :parcel_type, String, required: false
      argument :country, String, required: false
      argument :ownership_fields, GraphQL::Types::JSON, required: false
      argument :status, String, required: false
      argument :object_type, String, required: false
      argument :house_land_parcel_id, ID, required: false

      field :land_parcel, Types::LandParcelType, null: true

      # rubocop:disable Metrics/MethodLength
      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        ActiveRecord::Base.transaction do
          land_parcel = context[:site_community].land_parcels.create!(
            vals.except(:ownership_fields),
          )

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
        return true if permitted?(module: :land_parcel, permission: :can_create_land_parcel)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
