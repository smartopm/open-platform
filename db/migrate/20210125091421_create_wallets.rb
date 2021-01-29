class CreateWallets < ActiveRecord::Migration[6.0]
  def change
    create_table :wallets, id: :uuid do |t|
      t.references :user, null: false, type: :uuid, foreign_key: true
      t.string :currency
      t.float :balance
      t.float :pending_balance

      t.timestamps
    end
  end
end
