class AddSettledInvoicesToDeposit < ActiveRecord::Migration[6.0]
  def change
    add_column :wallet_transactions, :settled_invoices, :json
  end
end
