class AddDefaultUsersToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :default_users, :string, array: true, default: []
  end
end
