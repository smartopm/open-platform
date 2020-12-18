class ChangePaymentAmountType < ActiveRecord::Migration[6.0]
  def change
    change_column :payments, :amount, :float
  end
end
