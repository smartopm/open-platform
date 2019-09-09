# frozen_string_literal: true

# A Member passthrough table tying Users to Communities
class Member < ApplicationRecord
  belongs_to :community
  belongs_to :user
  belongs_to :role
end
