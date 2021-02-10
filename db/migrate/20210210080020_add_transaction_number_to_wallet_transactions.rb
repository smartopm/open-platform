class AddTransactionNumberToWalletTransactions < ActiveRecord::Migration[6.0]
  def change
    add_column :wallet_transactions, :transaction_number, :string, unique: true
  end
end
