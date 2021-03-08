class AddPaymentPlanAssociationToInvoice < ActiveRecord::Migration[6.0]
  def change
    add_reference :invoices, :payment_plan, type: :uuid, null: true, foreign_key: true
  end
end
