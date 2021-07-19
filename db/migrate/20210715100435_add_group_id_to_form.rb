class AddGroupIdToForm < ActiveRecord::Migration[6.0]
  def change
    add_column :forms, :grouping_id, :uuid
    change_column :forms , :version_number , :integer, default: 1
  end
end
