# frozen_string_literal: true

module Mutations
  module LandParcel
    # Create a new Land Parcel
    class PropertyMerge < BaseMutation
      argument :id, ID, required: true
      argument :parcel_number, String, required: true

      field :land_parcel, Types::LandParcelType, null: true

      def resolve(vals)
        land_parcel = context[:site_community].land_parcels.find_by(id: vals[:id])
        raise GraphQL::ExecutionError, 'Land Parcel not found' unless land_parcel

        ActiveRecord::Base.transaction do
          land_parcel.update!(vals)

          { land_parcel: land_parcel }
        end
      rescue ActiveRecord::RecordInvalid => e
        raise GraphQL::ExecutionError, e.message
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end
