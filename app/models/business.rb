# frozen_string_literal: true

# Business belongs to a user and one user can have multiple businesses
class Business < ApplicationRecord
  belongs_to :community
  belongs_to :user

  validates :name, presence: true
  validates :community_id, presence: true

  default_scope { where('status != ?', "deleted") }
end
