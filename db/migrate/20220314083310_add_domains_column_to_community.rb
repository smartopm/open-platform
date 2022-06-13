class AddDomainsColumnToCommunity < ActiveRecord::Migration[6.1]
  def change
    add_column :communities, :domains, :string, array: true, default: []
  end
end
