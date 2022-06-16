# frozen_string_literal: true

# Amenities Record
class Amenity < ApplicationRecord
  belongs_to :user, class_name: 'Users::User'
  belongs_to :community

  default_scope { order(created_at: :desc) }

  has_paper_trail
end
