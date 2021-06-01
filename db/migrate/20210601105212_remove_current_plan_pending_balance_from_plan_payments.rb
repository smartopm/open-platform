class RemoveCurrentPlanPendingBalanceFromPlanPayments < ActiveRecord::Migration[6.0]
  def change
    remove_column :plan_payments, :current_plot_pending_balance, :decimal, precision: 11, scale: 2
  end
end
