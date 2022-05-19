class AddGroupingNameToLabels < ActiveRecord::Migration[6.1]
  def change
    add_column :labels, :grouping_name, :string 
  end
end
