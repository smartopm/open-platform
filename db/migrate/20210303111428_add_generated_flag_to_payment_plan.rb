class AddGeneratedFlagToPaymentPlan < ActiveRecord::Migration[6.0]
  def change
    add_column :payment_plans, :generated, :boolean, default: false
  end
end
