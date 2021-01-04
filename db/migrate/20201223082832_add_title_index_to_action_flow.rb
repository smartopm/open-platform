class AddTitleIndexToActionFlow < ActiveRecord::Migration[6.0]
  def change
    add_index :action_flows, :title, unique: true
  end
end
