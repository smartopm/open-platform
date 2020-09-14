class AddStatusToCampaignTable < ActiveRecord::Migration[6.0]
  def change
    add_column :campaigns, :status, :integer, default: 0
  end
end
