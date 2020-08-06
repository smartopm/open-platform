# frozen_string_literal: true

# Notes for the CRM portion of the app, attached to a user
class Note < ApplicationRecord
  include SearchCop

  search_scope :search do
    attributes assignees: ['assignees.name']
    scope { includes(:assignees, :author).eager_load(:assignee_notes, :assignees) }
  end

  belongs_to :community
  belongs_to :user
  belongs_to :author, class_name: 'User'
  has_many :assignee_notes, dependent: :destroy
  has_many :assignees, through: :assignee_notes, source: :user

  default_scope { order(created_at: :desc) }
  VALID_CATEGORY = %w[call email text message to_do other].freeze
  validates :category, inclusion: { in: VALID_CATEGORY, allow_nil: true }

  def assign_or_unassign_user(user_id)
    a_notes = assignee_notes.find_by(user_id: user_id)
    if a_notes.present?
      a_notes.delete
    else
      assignee_notes.create!(user_id: user_id, note_id: self[:id])
    end
  end
end
