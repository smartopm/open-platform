class AddUniqueIndexOnActionFlowTitleAndCommunity < ActiveRecord::Migration[6.1]
  def change
    remove_index :action_flows, :title
    add_index :action_flows, [:title, :community_id], unique: true
  end
end
