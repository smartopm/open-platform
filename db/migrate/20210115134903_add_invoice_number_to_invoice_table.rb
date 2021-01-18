class AddInvoiceNumberToInvoiceTable < ActiveRecord::Migration[6.0]
  def change
    add_column :invoices, :invoice_number, :integer
  end
end
