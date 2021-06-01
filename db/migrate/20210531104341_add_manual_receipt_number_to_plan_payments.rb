class AddManualReceiptNumberToPlanPayments < ActiveRecord::Migration[6.0]
  def change
    add_column :plan_payments, :manual_receipt_number, :string
    add_index :plan_payments, %i[manual_receipt_number community_id], unique: true
  end
end
