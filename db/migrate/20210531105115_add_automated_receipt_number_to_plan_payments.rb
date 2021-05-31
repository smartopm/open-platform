class AddAutomatedReceiptNumberToPlanPayments < ActiveRecord::Migration[6.0]
  def up
    add_column :plan_payments, :automated_receipt_number, :integer
    execute "CREATE SEQUENCE automated_receipt_numbers_seq START 1000 OWNED BY
            plan_payments.automated_receipt_number;"
    execute "UPDATE plan_payments SET automated_receipt_number = nextval('automated_receipt_numbers_seq') 
            WHERE automated_receipt_number IS NULL;"
    change_column_default(:plan_payments, :automated_receipt_number, from: nil, to: -> { "(nextval('automated_receipt_numbers_seq'::regclass))" })
  end

  def down
    remove_column :plan_payments, :automated_receipt_number, :string
  end
end
