# frozen_string_literal: true

# Notes for the CRM portion of the app, attached to a user
class Note < ApplicationRecord
  belongs_to :community
  belongs_to :user
  belongs_to :author, class_name: 'User'
  has_many :assignee_notes, dependent: :destroy
  has_many :assignees, through: :assignee_notes, source: :user

  default_scope { order(created_at: :desc) }
  VALID_CATEGORY = %w[call email text message to_do other].freeze
  validates :category, inclusion: { in: VALID_CATEGORY, allow_nil: true }
end

# # user_id
# user.notes ==> owner(already implemented via user_id)
# user.assigned_notes
# note.assignees ~
