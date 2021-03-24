class AddReceiptNumberToWalletTransaction < ActiveRecord::Migration[6.0]
  def change
    add_column :wallet_transactions, :receipt_number, :string
    add_column :wallet_transactions, :originally_created_at, :datetime
  end
end
