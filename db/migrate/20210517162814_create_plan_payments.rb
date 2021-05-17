class CreatePlanPayments < ActiveRecord::Migration[6.0]
  def change
    create_table :plan_payments, id: :uuid do |t|
      t.decimal :amount
      t.integer :status
      t.references :transaction, type: :uuid, null: false, foreign_key: true
      t.references :user, null: false,  type: :uuid, foreign_key: true
      t.references :community, type: :uuid, null: false, foreign_key: true
      t.references :payment_plan, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end



