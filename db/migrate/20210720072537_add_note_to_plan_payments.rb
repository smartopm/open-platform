class AddNoteToPlanPayments < ActiveRecord::Migration[6.0]
  def change
    add_column :plan_payments, :note, :string
  end
end
