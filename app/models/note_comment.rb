# frozen_string_literal: true

# Notes specific Comments
class NoteComment < ApplicationRecord
  include NoteHistoryRecordable

  belongs_to :note
  belongs_to :user

  default_scope { where('status != ?', 'deleted').order(created_at: :desc) }

  belongs_to :note_entity, polymorphic: true, optional: true
end
