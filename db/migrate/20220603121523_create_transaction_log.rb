class CreateTransactionLog < ActiveRecord::Migration[6.1]
  def change
    create_table :transaction_logs, id: :uuid do |t|
      t.decimal :paid_amount
      t.string :currency
      t.decimal :amount
      t.string :invoice_number
      t.string :transaction_id
      t.string :transaction_ref
      t.string :description
      t.string :account_name
      t.integer :integration_type, default: 0

      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :community, null: false, foreign_key: true, type: :uuid
      t.timestamps
    end
  end
end