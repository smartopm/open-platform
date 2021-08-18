class CreateSubscriptionPlans < ActiveRecord::Migration[6.0]
  def change
    create_table :subscription_plans, id: :uuid do |t|
      t.integer :plan_type
      t.integer :status, default: 0
      t.date :start_date
      t.date :end_date
      t.decimal :amount
      t.references :community, type: :uuid, null: false, foreign_key: true

      t.timestamps
    end
  end
end
