# frozen_string_literal: true

# Notes specific Comments
class NoteComment < ApplicationRecord
  include NoteHistoryRecordable

  belongs_to :note
  belongs_to :user

  after_create :log_create_event
  after_update :log_update_event

  default_scope { where('status != ?', 'deleted').order(created_at: :desc) }

  belongs_to :note_entity, polymorphic: true, optional: true

  private

  def log_create_event
    user.generate_events('note_comment_create', self)
  end

  def log_update_event
    user.generate_events('note_comment_update', self)
  end
end
