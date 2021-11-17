# frozen_string_literal: true

# Role model
class Role < ApplicationRecord
  belongs_to :community, optional: true

  validates :name, presence: true,
                   uniqueness: { scope: :community_id,
                                 case_sensitive: false }
end
