class RecreateShowroomTable < ActiveRecord::Migration[6.0]
  def change
    drop_table :showrooms
    drop_table :showroom
  end
end
