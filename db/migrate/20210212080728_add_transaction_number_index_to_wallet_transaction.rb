class AddTransactionNumberIndexToWalletTransaction < ActiveRecord::Migration[6.0]
  def change
    add_index :wallet_transactions, :transaction_number, unique: true
  end
end
