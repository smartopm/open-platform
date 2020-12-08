class RemoveActiveColumnFromActionFlowTable < ActiveRecord::Migration[6.0]
  def change
    remove_column :action_flows, :active
  end
end
