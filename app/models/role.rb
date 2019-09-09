class Role < ApplicationRecord
  has_many :members
  belongs_to :community
end
