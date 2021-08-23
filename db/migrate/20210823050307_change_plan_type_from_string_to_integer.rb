class ChangePlanTypeFromStringToInteger < ActiveRecord::Migration[6.0]
  def up
    change_column :payment_plans, :plan_type, "integer USING CAST(REPLACE(plan_type, plan_type, '0') AS integer)"
  end

  def down
    change_column :payment_plans, :plan_type, :string
  end
end
