class AddMenuItemToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :menu_items, :json
  end
end
