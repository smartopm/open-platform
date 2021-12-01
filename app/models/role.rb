# frozen_string_literal: true

# Permission class
class Role < ApplicationRecord
  has_many :permissions, dependent: :destroy
  belongs_to :community, optional: true

  validates :name, presence: true,
                   uniqueness: { scope: :community_id,
                                 case_sensitive: false }
end
