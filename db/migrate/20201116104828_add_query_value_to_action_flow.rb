class AddQueryValueToActionFlow < ActiveRecord::Migration[6.0]
  def change
    add_column :action_flows, :event_condition_query, :string
  end
end
