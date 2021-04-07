class ChangeWalletTransactionBalanceTypeToBigDecimal < ActiveRecord::Migration[6.0]
  def up
    change_column :wallet_transactions, :amount, :decimal, precision: 11, scale: 2
    change_column :wallet_transactions, :current_wallet_balance, :decimal, precision: 11, scale: 2
  end

  def down
    change_column :wallet_transactions, :amount, :float
    change_column :wallet_transactions, :current_wallet_balance, :float
  end
end
