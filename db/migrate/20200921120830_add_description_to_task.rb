class AddDescriptionToTask < ActiveRecord::Migration[6.0]
  def change
    add_column :notes, :description, :text
  end
end
