class AddReplyInfoToNoteComment < ActiveRecord::Migration[6.1]
  def change
    add_column :note_comments, :reply_required, :boolean, default: false
    add_column :note_comments, :replied_at, :datetime
    add_column :note_comments, :grouping_id, :uuid
    add_column :note_comments, :reply_from_id, :uuid, null: true, foreign_key: true
  end
end
