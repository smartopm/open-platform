# frozen_string_literal: true

# Notes for the CRM portion of the app, attached to a user
class Note < ApplicationRecord
  belongs_to :community
  belongs_to :user
  belongs_to :author, class_name: 'User'

  default_scope { order(created_at: :desc) }
  VALID_CATEGORY = %w[call email text message to_do other].freeze
  validates :category, inclusion: { in: VALID_CATEGORY, allow_nil: true }
end
