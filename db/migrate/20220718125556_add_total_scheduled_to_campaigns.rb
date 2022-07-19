class AddTotalScheduledToCampaigns < ActiveRecord::Migration[6.1]
  def change
    add_column :campaigns, :total_scheduled, :integer, default: 0
  end
end
