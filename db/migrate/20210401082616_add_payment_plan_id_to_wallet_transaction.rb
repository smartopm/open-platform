class AddPaymentPlanIdToWalletTransaction < ActiveRecord::Migration[6.0]
  def change
    add_reference :wallet_transactions, :payment_plan, type: :uuid, null: true, foreign_key: true
  end
end
