class ChangeInvoicesAmountTypeToBigDecimal < ActiveRecord::Migration[6.0]
  def up
    change_column :invoices, :amount, :decimal, precision: 11, scale: 2
    change_column :invoices, :pending_amount, :decimal, precision: 11, scale: 2
  end

  def down
    change_column :invoices, :amount, :float
    change_column :invoices, :pending_amount, :float
  end
end
