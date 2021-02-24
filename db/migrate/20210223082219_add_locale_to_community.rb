class AddLocaleToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :locale, :string
  end
end
