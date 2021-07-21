class AddGroupIdToForm < ActiveRecord::Migration[6.0]
  def change
    add_column :forms, :grouping_id, :uuid
    change_column_default(:forms, :version_number, from: nil, to: 1)
  end
end
