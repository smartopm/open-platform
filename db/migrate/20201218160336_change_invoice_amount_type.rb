class ChangeInvoiceAmountType < ActiveRecord::Migration[6.0]
  def change
    change_column :invoices, :amount, :float
  end
end
