class CreateCampaigns < ActiveRecord::Migration[6.0]
  def change
    create_table :campaigns, id: :uuid do |t|
      t.references :community, null: false, type: :uuid, foreign_key: true
      t.string :name
      t.string :message
      t.text :user_id_list
      t.datetime :start_time
      t.datetime :end_time
      t.datetime :batch_time

      t.timestamps
    end
  end
end
