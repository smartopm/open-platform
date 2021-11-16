class AddAppRoleToUsers < ActiveRecord::Migration[6.1]
  def change
    add_reference :users, :role, null: true, foreign_key: true, type: :uuid, index: true
  end
end
