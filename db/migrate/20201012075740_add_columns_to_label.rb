class AddColumnsToLabel < ActiveRecord::Migration[6.0]
  def change
    add_column :labels, :description, :string
    add_column :labels, :color, :string, default: '#f6f6f6' 
  end
end
