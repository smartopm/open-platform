class AddParentNoteIdToNotes < ActiveRecord::Migration[6.1]
  def change
    add_reference :notes, :parent_note, type: :uuid, foreign_key: { to_table: :notes }
  end
end
