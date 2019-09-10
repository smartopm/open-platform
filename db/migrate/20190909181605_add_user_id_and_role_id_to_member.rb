class AddUserIdAndRoleIdToMember < ActiveRecord::Migration[6.0]
  def change
    add_column :members, :user_id, :uuid
    add_column :members, :role_id, :uuid
  end
end
