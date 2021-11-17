# frozen_string_literal: true

# Permission model
class Permission < ApplicationRecord
  belongs_to :role
  validates :module, uniqueness: { scope: :role_id, case_sensitive: false }
end
