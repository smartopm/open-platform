class CreateAssigneeNotes < ActiveRecord::Migration[6.0]
  def change
    create_table :assignee_notes, id: :uuid do |t|
      t.references :user, null: false, type: :uuid, foreign_key: true
      t.references :note, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
    add_index :assignee_notes, [:user_id, :note_id], :unique => true
  end
end
