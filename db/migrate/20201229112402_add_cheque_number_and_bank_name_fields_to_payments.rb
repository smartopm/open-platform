class AddChequeNumberAndBankNameFieldsToPayments < ActiveRecord::Migration[6.0]
  def change
    add_column :payments, :bank_name, :string
    add_column :payments, :cheque_number, :string
  end
end
