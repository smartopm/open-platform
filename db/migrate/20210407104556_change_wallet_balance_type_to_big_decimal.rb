class ChangeWalletBalanceTypeToBigDecimal < ActiveRecord::Migration[6.0]
  def up
    change_column :wallets, :balance, :decimal, precision: 11, scale: 2
    change_column :wallets, :pending_balance, :decimal, precision: 11, scale: 2
  end

  def down
    change_column :wallets, :balance, :float
    change_column :wallets, :pending_balance, :float
  end
end
