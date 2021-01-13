class AddSpatialColumnsToLandParcel < ActiveRecord::Migration[6.0]
  def change
    add_column :land_parcels, :long_x, :decimal, precision: 10, scale: 6 
    add_column :land_parcels, :lat_y, :decimal, precision: 10, scale: 6
    add_column :land_parcels, :geom, :json
  end
end
