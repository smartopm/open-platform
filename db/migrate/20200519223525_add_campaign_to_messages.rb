class AddCampaignToMessages < ActiveRecord::Migration[6.0]
  def change
    add_reference :messages, :campaign, null: true, type: :uuid
    # add_column :messages, :campaign_id, :uuid
  end
end
