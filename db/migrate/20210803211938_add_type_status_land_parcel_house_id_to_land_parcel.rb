class AddTypeStatusLandParcelHouseIdToLandParcel < ActiveRecord::Migration[6.0]
  def change
    add_column :land_parcels, :object_type, :string
    add_column :land_parcels, :status, :string
    add_column :land_parcels, :house_land_parcel_id, :uuid
  end
end
