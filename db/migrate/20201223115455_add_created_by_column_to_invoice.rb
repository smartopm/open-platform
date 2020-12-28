class AddCreatedByColumnToInvoice < ActiveRecord::Migration[6.0]
  def change
    add_reference :invoices, :created_by, references: :users, type: :uuid
  end
end
