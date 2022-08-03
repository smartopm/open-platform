# frozen_string_literal: true

module Mutations
  module Amenity
    # Update Amenity
    class AmenityUpdate < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false
      argument :description, String, required: false
      argument :location, String, required: false
      argument :hours, String, required: false
      argument :invitation_link, String, required: false
      argument :status, String, required: false

      field :amenity, Types::AmenityType, null: false

      def resolve(vals)
        validate_authorization(:amenity, :can_edit_amenities)

        amenity = context[:site_community].amenities.find(vals[:id])
        return { amenity: amenity } if amenity.update(vals)

        raise_error_message(amenity.errors.full_messages&.join(', '))
      end
    end
  end
end
