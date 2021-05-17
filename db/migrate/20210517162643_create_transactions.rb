class CreateTransactions < ActiveRecord::Migration[6.0]
  def change
    create_table :transactions, id: :uuid do |t|
      t.string :source
      t.integer :status
      t.decimal :amount
      t.decimal :unused_amount
      t.datetime :originally_created_at
      t.string :transaction_number
      t.string :cheque_number
      t.string :bank_name
      t.uuid :depositor_id
      t.references :community, type: :uuid, null: false, foreign_key: true
      t.references :user, type: :uuid, null: false, foreign_key: true

      t.index :depositor_id
      t.index :transaction_number, unique: true
      t.timestamps
    end
  end
end

