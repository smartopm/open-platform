class CreateCampaignLabel < ActiveRecord::Migration[6.0]
  def change
    create_table :campaign_labels, id: :uuid do |t|
      t.references :campaign, null: false, type: :uuid, foreign_key: true
      t.references :label, null: false, type: :uuid, foreign_key: true
    end
    add_index :campaign_labels, [:campaign_id, :label_id], :unique => true
  end
end
