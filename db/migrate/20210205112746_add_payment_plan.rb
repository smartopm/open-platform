class AddPaymentPlan < ActiveRecord::Migration[6.0]
  def change
    create_table :payment_plans, id: :uuid do |t|
      t.references :user, null: false, type: :uuid, foreign_key: true
      t.references :land_parcel, null: false, type: :uuid, foreign_key: true
      t.string :type
      t.datetime :start_date
      t.integer :status
      t.string :percentage

      t.timestamps
    end
  end
end
