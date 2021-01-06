class AddCurrencyToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :currency, :string
  end
end
