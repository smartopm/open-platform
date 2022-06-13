class AddUniqueIndexToNoteList < ActiveRecord::Migration[6.1]
  def change
    add_index :note_lists, [:name, :community_id], unique: true
  end
end