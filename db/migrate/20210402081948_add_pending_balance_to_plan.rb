class AddPendingBalanceToPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :payment_plans, :pending_balance, :float, default: 0
  end
end
