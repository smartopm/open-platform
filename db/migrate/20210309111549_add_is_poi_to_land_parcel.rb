class AddIsPoiToLandParcel < ActiveRecord::Migration[6.0]
  def change
    add_column :land_parcels, :is_poi, :boolean, default: false
    add_column :land_parcels, :deleted_status, :integer, default: 0
    add_index :land_parcels, :deleted_status
  end
end
