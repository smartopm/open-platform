class AddTimeStampsToDiscussions < ActiveRecord::Migration[6.0]
  def change
    add_column :discussions, :created_at, :datetime, null: false
    add_column :discussions, :updated_at, :datetime, null: false
  end
end
