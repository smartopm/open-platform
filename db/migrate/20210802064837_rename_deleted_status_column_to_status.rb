class RenameDeletedStatusColumnToStatus < ActiveRecord::Migration[6.0]
  def change
    rename_column :land_parcels, :deleted_status, :status
  end
end
