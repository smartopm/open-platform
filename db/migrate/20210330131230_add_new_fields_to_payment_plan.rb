class AddNewFieldsToPaymentPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :payment_plans, :total_amount, :decimal, precision: 11, scale: 2
    add_column :payment_plans, :duration_in_month, :integer
  end
end
