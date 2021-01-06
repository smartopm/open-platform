class AddStatusToActionFlows < ActiveRecord::Migration[6.0]
  def change
    add_column :action_flows, :status, :string, default: "not_deleted"
  end
end
