class ChangeDuarationInMonthColumnNameToDuration < ActiveRecord::Migration[6.0]
  def change
    rename_column :payment_plans, :duration_in_month, :duration
  end
end
