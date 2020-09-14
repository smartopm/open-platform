class AddMessageCountToCampaign < ActiveRecord::Migration[6.0]
  def change
    add_column :campaigns, :message_count, :integer, default: 0
  end
end
