class AddReceiptNumberToWalletTransaction < ActiveRecord::Migration[6.0]
  def change
    add_column :wallet_transactions, :receipt_number, :string
  end
end
