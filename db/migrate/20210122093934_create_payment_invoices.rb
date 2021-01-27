class CreatePaymentInvoices < ActiveRecord::Migration[6.0]
  def change
    create_table :payment_invoices, id: :uuid do |t|
      t.references :invoice, null: false, type: :uuid, foreign_key: true
      t.references :payment, null: false, type: :uuid, foreign_key: true
      t.references :wallet_transaction, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
    add_index :payment_invoices, [:payment_id, :invoice_id], :unique => true
  end
end
