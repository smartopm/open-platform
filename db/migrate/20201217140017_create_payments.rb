class CreatePayments < ActiveRecord::Migration[6.0]
  def change
    create_table :payments, id: :uuid do |t|
      t.belongs_to :user, null: false, type: :uuid, foreign_key: true
      t.belongs_to :invoice, null: false, type: :uuid, foreign_key: true
      t.string :payment_type
      t.integer :amount
      t.integer :payment_status

      t.timestamps
    end
  end
end
