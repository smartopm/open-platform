# frozen_string_literal: true

module Mutations
  module LandParcel
    # Update a Land Parcel
    class LandParcelUpdate < BaseMutation
      argument :id, ID, required: true

      argument :full_name, String, required: false
      argument :address1, String, required: false
      argument :address2, String, required: false
      argument :city, String, required: false
      argument :postal_code, String, required: false
      argument :state_province, String, required: false
      argument :country, String, required: false
      argument :parcel_number, String, required: true
      argument :parcel_type, String, required: false
      
      field :land_parcel_update, Types::LandParcelType, null: true

      def resolve(vals)
        land_parcel_update = context[:site_community].land_parcel.find_by(id: vals[:id])
        raise GraphQL::ExecutionError, 'Land Parcel not found' if land_parcel_update.nil?

        land_parcel_update.update(vals)

        return { land_parcel_update: land_parcel_update } if land_parcel_update
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end