class AddTimezoneToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :timezone, :string
  end
end