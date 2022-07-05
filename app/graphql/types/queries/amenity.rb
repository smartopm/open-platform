# frozen_string_literal: true

# amenity queries
module Types::Queries::Amenity
  extend ActiveSupport::Concern

  included do
    # get list of amenities
    field :amenities, [Types::AmenityType], null: true do
      description 'List of all amenities'
      argument :offset, Integer, required: false
      argument :limit, Integer, required: false
    end
  end

  def amenities(offset: 0, limit: 50)
    validate_authorization(:amenity, :can_access_amenities)

    context[:site_community].amenities
                            .not_deleted
                            .limit(limit)
                            .offset(offset)
  end
end
