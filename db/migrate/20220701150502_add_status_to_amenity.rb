class AddStatusToAmenity < ActiveRecord::Migration[6.1]
  def change
    add_column :amenities, :status, :integer, default: 0
  end
end
