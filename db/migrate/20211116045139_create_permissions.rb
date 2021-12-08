class CreatePermissions < ActiveRecord::Migration[6.1]
  def change
    create_table :permissions, id: :uuid do |t|
      t.references :role, null: false, foreign_key: true, type: :uuid
      t.string :module
      t.json :permissions

      t.timestamps
    end
  end
end
