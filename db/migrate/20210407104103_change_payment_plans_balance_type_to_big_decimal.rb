class ChangePaymentPlansBalanceTypeToBigDecimal < ActiveRecord::Migration[6.0]
  def up
    change_column :payment_plans, :plot_balance, :decimal, precision: 11, scale: 2
    change_column :payment_plans, :pending_balance, :decimal, precision: 11, scale: 2
  end

  def down
    change_column :payment_plans, :plot_balance, :float
    change_column :payment_plans, :pending_balance, :float
  end
end
