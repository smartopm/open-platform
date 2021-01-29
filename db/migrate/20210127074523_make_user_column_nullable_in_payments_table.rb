class MakeUserColumnNullableInPaymentsTable < ActiveRecord::Migration[6.0]
  def change
    change_column_null :payments, :user_id, true
    change_column_null :payments, :invoice_id, true
  end
end
