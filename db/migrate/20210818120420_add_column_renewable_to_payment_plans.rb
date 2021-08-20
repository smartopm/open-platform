class AddColumnRenewableToPaymentPlans < ActiveRecord::Migration[6.0]
  def change
    add_column :payment_plans, :renewable, :boolean, default:  false
  end
end
