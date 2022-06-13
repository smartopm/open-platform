class MakeRoleIdNotNullableForUsers < ActiveRecord::Migration[6.1]
  def change
    change_column_null :users, :role_id, false
  end
end
