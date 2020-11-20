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

      field :land_parcel, Types::LandParcelType, null: true

      def resolve(vals)
        land_parcel = context[:site_community].land_parcels.create!(vals)

        return { land_parcel: land_parcel } if land_parcel

        raise GraphQL::ExecutionError, land_parcel.errors.full_messages
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end
