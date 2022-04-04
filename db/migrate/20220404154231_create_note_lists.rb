class CreateNoteLists < ActiveRecord::Migration[6.1]
  def change
    create_table :note_lists, id: :uuid do |t|
      t.string :name
      t.references :community, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
