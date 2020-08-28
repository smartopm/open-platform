class AddEmailTypeFieldsToCampaign < ActiveRecord::Migration[6.0]
  def change
    add_column :campaigns, :campaign_type, :string, default: 'sms', null: false
    add_column :campaigns, :subject, :string
    add_column :campaigns, :pre_header, :string
    add_column :campaigns, :template_style, :string
    add_index :campaigns, :campaign_type
  end
end
