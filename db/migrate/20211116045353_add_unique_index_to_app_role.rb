class AddUniqueIndexToAppRole < ActiveRecord::Migration[6.1]
  def change
    add_index :roles, [:name, :community_id], unique: true
  end
end
