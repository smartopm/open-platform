class CreateInvoices < ActiveRecord::Migration[6.0]
  def change
    create_table :invoices, id: :uuid do |t|
      t.references :land_parcel, null: false, type: :uuid, foreign_key: true
      t.references :community, null: false, type: :uuid, foreign_key: true
      t.datetime :due_date
      t.integer :amount
      t.integer :status
      t.string :description
      t.string :note

      t.timestamps
    end
  end
end
