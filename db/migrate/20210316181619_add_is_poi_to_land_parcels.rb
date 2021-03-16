class AddIsPoiToLandParcels < ActiveRecord::Migration[6.0]
  def change
    add_column :land_parcels, :is_poi, :boolean, default: false
  end
end
