# frozen_string_literal: true

# Each Community has a their own set of roles (Contractors, Admins, Residents, etc)
class Role < ApplicationRecord
  has_many :members, dependent: :nullify
  belongs_to :community
end
