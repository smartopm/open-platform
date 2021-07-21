class AddFrequencyToPaymentPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :payment_plans, :frequency, :integer
    Properties::PaymentPlan.where(frequency: nil).update_all(frequency: 2)
  end
end
