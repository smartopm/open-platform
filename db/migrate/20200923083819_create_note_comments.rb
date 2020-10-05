class CreateNoteComments < ActiveRecord::Migration[6.0]
  def change
    create_table :note_comments, id: :uuid do |t|
      t.text :body
      t.belongs_to :note, type: :uuid, null: false, foreign_key: true
      t.belongs_to :user, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
