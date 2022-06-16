# frozen_string_literal: true

# amenity queries
module Types::Queries::Amenity
  extend ActiveSupport::Concern

  included do
    # get list of amenities
    field :amenities, [Types::AmenityType], null: true do
      description 'List of all amenities'
    end
  end

  def amenities
    validate_authorization(:amenity, :can_access_amenities)

    context[:site_community].amenities
  end
end
