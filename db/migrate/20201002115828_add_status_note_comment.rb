class AddStatusNoteComment < ActiveRecord::Migration[6.0]
  def change
    add_column :note_comments, :status, :string
  end
end
