class AddPendingAmountColumnToInvoices < ActiveRecord::Migration[6.0]
  def change
    add_column :invoices, :pending_amount, :float
  end
end
