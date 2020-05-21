class CreateLandParcels < ActiveRecord::Migration[6.0]
  def change
    create_table :land_parcels, id: :uuid do |t|
      t.references :community, null: false, type: :uuid, foreign_key: true
      t.string :parcel_number
      t.string :address1
      t.string :address2
      t.string :city
      t.string :postal_code
      t.string :state_province
      t.string :country
      t.string :parcel_type

      t.timestamps
    end
  end
end
