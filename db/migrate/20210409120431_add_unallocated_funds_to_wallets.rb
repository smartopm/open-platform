class AddUnallocatedFundsToWallets < ActiveRecord::Migration[6.0]
  def change
    add_column :wallets, :unallocated_funds, :decimal, precision: 11, scale: 2, default: 0
  end
end
