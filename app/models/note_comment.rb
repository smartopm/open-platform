class NoteComment < ApplicationRecord
  include NoteHistoryRecordable

  belongs_to :note
  belongs_to :user

  belongs_to :note_entity, polymorphic: true, optional: true
end
