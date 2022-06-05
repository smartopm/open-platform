class CreateTransactionLog < ActiveRecord::Migration[6.1]
  def change
    create_table :transaction_logs, id: :uuid do |t|
      t.decimal :paid_amount
      t.decimal :currency
      t.decimal :amount
      t.string :invoice_number
      t.integer :transaction_id
      t.integer :transaction_ref
      t.string :description
      t.integer :integration_type, default: 0

      t.references :user, null: false, foreign_key: true, type: :uuid
      t.references :community, null: false, foreign_key: true, type: :uuid
      t.timestamps
    end
  end
end