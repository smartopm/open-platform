class CreateWalletTransactions < ActiveRecord::Migration[6.0]
  def change
    create_table :wallet_transactions, id: :uuid do |t|
      t.string :source
      t.string :destination
      t.float :amount
      t.integer :status
      t.string :bank_name
      t.string :cheque_number
      t.float :current_wallet_balance
      t.references :user, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
  end
end
