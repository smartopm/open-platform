class AddSubStatusToUsers < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :sub_status, :integer
    add_index :users, :sub_status
  end
end
