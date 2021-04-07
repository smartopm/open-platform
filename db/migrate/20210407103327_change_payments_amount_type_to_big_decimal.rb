class ChangePaymentsAmountTypeToBigDecimal < ActiveRecord::Migration[6.0]
  def up
    change_column :payments, :amount, :decimal, precision: 11, scale: 2
  end

  def down
    change_column :payments, :amount, :float
  end
end
