class AddUniqueIndexToPermission < ActiveRecord::Migration[6.1]
  def change
    add_index :permissions, [:module, :role_id], unique: true
  end
end
