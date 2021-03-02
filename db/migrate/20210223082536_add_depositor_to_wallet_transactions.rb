class AddDepositorToWalletTransactions < ActiveRecord::Migration[6.0]
  def change
    add_reference :wallet_transactions, :depositor, references: :users, type: :uuid
  end
end
