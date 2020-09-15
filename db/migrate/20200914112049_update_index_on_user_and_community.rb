class UpdateIndexOnUserAndCommunity < ActiveRecord::Migration[6.0]
  def change
    remove_index :users, name: "index_users_on_email"
    remove_index :users, name: "index_users_on_uid_and_provider"
    add_index :users, [:uid, :provider, :community_id], unique: true
    add_index :users, [:community_id, :email], unique: true
  end
end
