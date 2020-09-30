class CreateNoteHistories < ActiveRecord::Migration[6.0]
  def change
    create_table :note_histories, id: :uuid do |t|
      t.string :attr_changed
      t.string :initial_value
      t.string :updated_value
      t.string :action
      t.references :note_entity, type: :uuid, polymorphic: true
      t.belongs_to :note, type: :uuid, null: false, foreign_key: true
      t.belongs_to :user, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
