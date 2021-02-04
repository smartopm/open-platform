class AddNextValToInvoiceNumber < ActiveRecord::Migration[6.0]
  def self.up
    change_column :invoices, :invoice_number, :bigint, default: -> { "nextval('global_seq')" }
  end

  def self.down
    change_column :invoices, :invoice_number, :integer
  end
end
