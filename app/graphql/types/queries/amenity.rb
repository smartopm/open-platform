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
    unless permitted?(admin: true, module: :amenity,
                      permission: :can_access_amenities)
      raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
    end

    context[:site_community].amenities
  end
end
