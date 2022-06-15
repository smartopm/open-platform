class AddSentToResidentToNoteComments < ActiveRecord::Migration[6.1]
  def change
    add_column :note_comments, :send_to_resident, :boolean
  end
end
