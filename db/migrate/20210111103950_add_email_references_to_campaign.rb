class AddEmailReferencesToCampaign < ActiveRecord::Migration[6.0]
  def change
    add_reference :campaigns, :email_templates, type: :uuid, foreign_key: true
  end
end
