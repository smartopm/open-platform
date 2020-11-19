class AddIncludeReplyLinkToCampaignTable < ActiveRecord::Migration[6.0]
  def change
    add_column :campaigns, :include_reply_link, :boolean, default: false
  end
end
