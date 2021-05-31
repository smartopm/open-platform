class AddManualReceiptNumberToPlanPayments < ActiveRecord::Migration[6.0]
  def change
    add_column :plan_payments, :manual_receipt_number, :string
  end
end
