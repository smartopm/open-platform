class ChangePlotBalanceTypeToFloat < ActiveRecord::Migration[6.0]
  def change
    change_column :payment_plans, :plot_balance, :float
  end
end
