class AddCategoryToNotifications < ActiveRecord::Migration[6.1]
  def change
    add_column :notifications, :category, :integer 
  end
end
