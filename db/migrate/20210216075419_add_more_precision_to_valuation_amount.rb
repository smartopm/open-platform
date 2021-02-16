class AddMorePrecisionToValuationAmount < ActiveRecord::Migration[6.0]
  def change
    change_column :valuations, :amount, :decimal, precision: 11, scale: 2
  end
end
