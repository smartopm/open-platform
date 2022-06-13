class AddAccessibilityToPosts < ActiveRecord::Migration[6.1]
  def change
    add_column :posts, :accessibility, :string
  end
end
