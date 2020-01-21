class AddFlaggedToNote < ActiveRecord::Migration[6.0]
  def change
    add_column :notes, :flagged, :boolean
  end
end
