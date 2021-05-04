class AddWpLinkToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :wp_link, :string
  end
end
