class AddStatusIndexToCampaign < ActiveRecord::Migration[6.0]
  def change
    add_index :campaigns, [:community_id, :status]
  end
end
