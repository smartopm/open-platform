class AddDisplayNameToCommunity < ActiveRecord::Migration[6.1]
  def change
    add_column :communities, :display_name, :string
  end
end
