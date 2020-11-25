class AddHostNameColumnToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :hostname, :string
  end
end
