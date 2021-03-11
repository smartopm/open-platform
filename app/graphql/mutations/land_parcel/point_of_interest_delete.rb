# frozen_string_literal: true

module Mutations
  module LandParcel
    # Delete an action flow
    class PointOfInterestDelete < BaseMutation
      argument :id, ID, required: true

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(id:)
        poi_to_delete = context[:site_community].land_parcels.find_by(id: id)
        raise GraphQL::ExecutionError, 'Poi Record not found' if poi_to_delete.nil?

        return { success: true } if poi_to_delete.update(deleted_status: 1)
      end

      def authorized?(_vals)
        raise GraphQL::ExecutionError, 'Unauthorized' unless context[:current_user].admin?

        true
      end
    end
  end
end
