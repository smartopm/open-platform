class AddIndexForParcelNumber < ActiveRecord::Migration[6.0]
  def change
    add_index :land_parcels, :parcel_number, unique: true
  end
end
