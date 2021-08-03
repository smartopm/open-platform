class RemoveManualReceiptNumberMigrationFromPlanPayments < ActiveRecord::Migration[6.0]
  def change
    remove_index :plan_payments, %i[manual_receipt_number community_id]
  end
end
