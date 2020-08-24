class AddEmailTypeFieldsToCampaign < ActiveRecord::Migration[6.0]
  def change
    add_column :campaigns, :campaign_type, :string
    add_column :campaigns, :subject, :string
    add_column :campaigns, :pre_header, :string
    add_column :campaigns, :template_style, :string
  end
end
