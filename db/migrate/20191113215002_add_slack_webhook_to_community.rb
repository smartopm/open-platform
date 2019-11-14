class AddSlackWebhookToCommunity < ActiveRecord::Migration[6.0]
  def change
    add_column :communities, :slack_webhook_url, :string
  end
end
