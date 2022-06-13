class CreatePermissions < ActiveRecord::Migration[6.1]
  def change
    create_table :permissions, id: :uuid do |t|
      t.string :module
      t.json :permissions
      t.references :role, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
    add_index :permissions, [:module, :role_id], :unique => true
  end
end
