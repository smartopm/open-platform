class AddOrderToNote < ActiveRecord::Migration[6.1]
  def change
    add_column :notes, :order, :integer, default: 1
  end
end
