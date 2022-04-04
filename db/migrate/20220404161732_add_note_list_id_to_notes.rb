class AddNoteListIdToNotes < ActiveRecord::Migration[6.1]
  def change
    add_reference :notes, :note_list, type: :uuid, foreign_key: { to_table: :note_lists }
  end
end
