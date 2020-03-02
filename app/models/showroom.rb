# frozen_string_literal: true

# Showroom
class Showroom < ApplicationRecord
  default_scope { order(created_at: :desc) }
end
