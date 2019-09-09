class Community < ApplicationRecord
  has_many :members
  has_many :roles
end
