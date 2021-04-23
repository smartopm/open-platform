class ChangePercentageTypeToDecimal < ActiveRecord::Migration[6.0]
  def up
    change_column :payment_plans, :percentage, 'decimal(11,2) USING CAST(percentage::numeric(11,2) AS decimal(11,2))'
  end

  def down
    change_column :payment_plans, :percentage, :string
  end
end
