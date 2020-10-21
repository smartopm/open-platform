# frozen_string_literal: true

module Mutations
  module LandParcel
    # Update a Land Parcel
    class LandParcelUpdate < BaseMutation
      argument :id, ID, required: true
      argument :parcel_number, String, required: true
      
      field :land_parcel_update, GraphQL::Types::Boolean, null: true

      def resolve(vals)
        land_parcel_update = context[:site_community].land_parcels.find_by(id: vals[:id])
        raise GraphQL::ExecutionError, 'Land Parcel not found' if land_parcel_update.nil?

        land_parcel_update.update(parcel_number: vals[:parcel_number])

        return { land_parcel_update: land_parcel_update } if land_parcel_update

        raise GraphQL::ExecutionError, land_parcel_update.errors.full_messages
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end