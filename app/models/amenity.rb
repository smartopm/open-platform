# frozen_string_literal: true

# Amenities Record
class Amenity < ApplicationRecord
  belongs_to :user, class_name: 'Users::User'
  belongs_to :community

  default_scope { order(created_at: :desc) }
  enum status: { published: 0, deleted: 1, deprecated: 2 }
  scope :existing, -> { where.not(status: 1) }

  has_paper_trail
end
