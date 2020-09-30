# frozen_string_literal: true

# Common method for note entities to call and record changes made to them
module NoteHistoryRecordable
  extend ActiveSupport::Concern

  def record_note_history(current_user, saved_changes = nil)
    return add_create_history(current_user) unless saved_changes

    add_update_history(current_user, saved_changes)
  end

  def add_create_history(user)
    history = note_history('create', user)
    history.save!
  end

  def add_update_history(user, saved_changes)
    saved_changes.each do |attr, val|
      history = note_history('update', user)
      history.attr_changed = attr.to_s
      history.initial_value = val.first
      history.updated_value = val.last
      history.save!
    end
  end

  def note_history(action, user)
    NoteHistory.new(
      action: action,
      user: user,
      note_entity_type: self.class.name,
      note_entity_id: id,
      note_id: associated_note,
    )
  end

  def associated_note
    attribute_present?(:note_id) ? note_id : id
  end
end
