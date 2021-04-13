class AddPaymentDayToPaymentPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :payment_plans, :payment_day, :Integer, default: 1
  end
end
