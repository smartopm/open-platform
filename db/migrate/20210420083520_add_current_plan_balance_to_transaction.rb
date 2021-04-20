class AddCurrentPlanBalanceToTransaction < ActiveRecord::Migration[6.0]
  def change
    add_column :wallet_transactions, :current_plan_balance, :decimal, precision: 11, scale: 2
  end
end
