class AddPrefixToAutomatedAndManualReceiptNumber < ActiveRecord::Migration[6.0]
  def up
    change_column :plan_payments, :manual_receipt_number, "varchar USING REPLACE(manual_receipt_number,manual_receipt_number,'MI'||manual_receipt_number)"
    change_column :plan_payments, :automated_receipt_number, "varchar USING REPLACE(CAST(automated_receipt_number AS text),CAST(automated_receipt_number AS text),'SI'||automated_receipt_number)"
    change_column_default(:plan_payments, :automated_receipt_number, from: -> { "(nextval('automated_receipt_numbers_seq'::regclass))" }, to: -> { "'SI'||(nextval('automated_receipt_numbers_seq'::regclass))" })
  end

  def down
    change_column_default(:plan_payments, :automated_receipt_number, from: -> { "'SI'||(nextval('automated_receipt_numbers_seq'::regclass))" }, to: -> { "(nextval('automated_receipt_numbers_seq'::regclass))" })
    change_column :plan_payments, :automated_receipt_number, "integer USING CAST(REGEXP_REPLACE(automated_receipt_number,'[[:alpha:]]','','g') AS integer)"
    change_column :plan_payments, :manual_receipt_number, "varchar USING REPLACE(manual_receipt_number,'MI','')"
  end
end
