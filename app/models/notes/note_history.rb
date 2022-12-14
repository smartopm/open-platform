# frozen_string_literal: true

module Notes
  # Stores all the changes and updates in entities associated to notes
  class NoteHistory < ApplicationRecord
    belongs_to :note
    belongs_to :user, class_name: 'Users::User'

    # has_one :note_comment, as: :note_entity
    # has_one :message, as: :note_entity

    # Prefer using this method to get associated entity
    def entity
      return if note_entity_type.nil? || note_entity_id.nil?

      note_entity_type.constantize.find(note_entity_id)
    end
  end
end
