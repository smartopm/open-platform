class AddDateTimeToNote < ActiveRecord::Migration[6.0]
  def change
    add_column :notes, :created_at, :datetime 
  end
end
