class NoteHistory < ApplicationRecord
  belongs_to :note
  belongs_to :user

  has_one :note_comment, as: :note_entity
  has_one :message, as: :note_entity

  def entity
    return if note_entity_type.nil? || note_entity_id.nil?

    note_entity_type.constantize.find(note_entity_id)
  end
end
