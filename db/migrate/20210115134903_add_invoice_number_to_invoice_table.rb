class AddInvoiceNumberToInvoiceTable < ActiveRecord::Migration[6.0]
  def self.up
    add_column :invoices, :invoice_number, :integer
    
    execute "CREATE SEQUENCE global_seq START 1101"
  end

  def self.down
    remove_column :invoices, :invoice_number

    execute "DROP SEQUENCE global_seq"
  end
end
