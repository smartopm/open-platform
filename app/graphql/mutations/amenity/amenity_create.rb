# frozen_string_literal: true

module Mutations
  module Amenity
    # Create transactionlog
    class AmenityCreate < BaseMutation
      argument :name, String, required: true
      argument :description, String, required: false
      argument :location, String, required: true
      argument :hours, String, required: true
      argument :invitation_link, String, required: false

      field :success, GraphQL::Types::Boolean, null: false

      def resolve(vals)
        amenity_attributes = vals.merge(community_id: context[:site_community].id)
        amenity = context[:current_user].amenities.create!(amenity_attributes)

        return { success: true } if amenity.persisted?

        raise GraphQL::ExecutionError, log.errors.full_messages
      end

      def authorized?(_vals)
        return true if permitted?(module: :amenity, permission: :can_create_amenity)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
