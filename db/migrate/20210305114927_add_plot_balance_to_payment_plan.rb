class AddPlotBalanceToPaymentPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :payment_plans, :plot_balance, :integer, default: 0
  end
end
