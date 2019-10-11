class AddStatusToUser < ActiveRecord::Migration[6.0]
  def change
    add_column :users, :state, :string
    remove_column :users, :first_name
    remove_column :users, :last_name
  end
end
