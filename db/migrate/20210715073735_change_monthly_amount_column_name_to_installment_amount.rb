class ChangeMonthlyAmountColumnNameToInstallmentAmount < ActiveRecord::Migration[6.0]
  def change
    rename_column :payment_plans, :monthly_amount, :installment_amount
  end
end
