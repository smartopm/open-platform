class RenameNotesToNoteOnActivityLog < ActiveRecord::Migration[6.0]
  def change
    rename_column :activity_logs, :notes, :note
  end
end
