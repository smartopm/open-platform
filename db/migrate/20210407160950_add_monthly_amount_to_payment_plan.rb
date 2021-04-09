class AddMonthlyAmountToPaymentPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :payment_plans, :monthly_amount, :decimal, precision: 11, scale: 2
  end
end
