# frozen_string_literal: true

module Mutations
  module Amenity
    # Delete Amenity
    class AmenityDelete < BaseMutation
      argument :id, ID, required: true
      argument :status, String, required: true

      field :amenity, Types::AmenityType, null: false

      def resolve(vals)
        validate_authorization(:amenity, :can_delete_amenities)

        amenity = context[:site_community].amenities.find(vals[:id])
        return { amenity: amenity } if amenity.update(vals)

        raise_error_message(amenity.errors.full_messages&.join(', '))
      end
    end
  end
end
