class CreateValuations < ActiveRecord::Migration[6.0]
  def change
    create_table :valuations, id: :uuid do |t|
      t.date :start_date
      t.decimal :amount, precision: 8, scale: 2
      t.references :land_parcel, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
  end
end
