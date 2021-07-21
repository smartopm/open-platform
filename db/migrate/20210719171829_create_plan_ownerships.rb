class CreatePlanOwnerships < ActiveRecord::Migration[6.0]
  def change
    create_table :plan_ownerships, id: :uuid do |t|
      t.references :user, null: false, type: :uuid, foreign_key: true
      t.references :payment_plan, null: false, type: :uuid, foreign_key: true
      t.index [:user_id, :payment_plan_id], unique: true

      t.timestamps
    end
  end
end
