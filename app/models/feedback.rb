# frozen_string_literal: true

# Feedback from users
class Feedback < ApplicationRecord
  belongs_to :user
  default_scope { order(created_at: :desc) }
end
