class AddThemeColorsToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :theme_colors, :json
  end
end
