class ChangeDefaultRenewable < ActiveRecord::Migration[6.0]
  def change
    change_column_default :payment_plans, :renewable, from: false, to: true
  end
end
