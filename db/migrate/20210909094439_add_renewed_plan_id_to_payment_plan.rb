class AddRenewedPlanIdToPaymentPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :payment_plans, :renewed_plan_id, :uuid
  end
end
