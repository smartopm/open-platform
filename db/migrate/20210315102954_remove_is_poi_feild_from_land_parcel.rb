class RemoveIsPoiFeildFromLandParcel < ActiveRecord::Migration[6.0]
  def change
    remove_column :land_parcels, :is_poi
  end
end
