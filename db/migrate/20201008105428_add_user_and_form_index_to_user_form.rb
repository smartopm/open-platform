class AddUserAndFormIndexToUserForm < ActiveRecord::Migration[6.0]
  def change
    add_index :form_users, [:user_id, :form_id], unique: true
  end
end
