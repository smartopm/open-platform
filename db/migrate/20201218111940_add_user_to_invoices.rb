class AddUserToInvoices < ActiveRecord::Migration[6.0]
  def change
    add_reference :invoices, :user, type: :uuid, foreign_key: true
  end
end
