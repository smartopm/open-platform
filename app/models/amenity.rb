# frozen_string_literal: true

# Manages Amenities
module Amenity
  # Amenities Record
  class Amenity < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'
    belongs_to :community

    has_paper_trail
  end
end
