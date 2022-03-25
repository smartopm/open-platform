class AddHotjarToCommunity < ActiveRecord::Migration[6.1]
  def change
    add_column :communities, :hotjar, :integer
  end
end
