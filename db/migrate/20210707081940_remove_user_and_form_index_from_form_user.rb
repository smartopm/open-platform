class RemoveUserAndFormIndexFromFormUser < ActiveRecord::Migration[6.0]
  def change
    remove_index :form_users, [:user_id, :form_id]
  end
end
