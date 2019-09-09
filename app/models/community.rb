# frozen_string_literal: true

# A Community is a city, or organization under which members/citizens exist
class Community < ApplicationRecord
  has_many :members, dependent: :destroy
  has_many :roles, dependent: :destroy
end
