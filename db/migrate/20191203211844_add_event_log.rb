class AddEventLog < ActiveRecord::Migration[6.0]
  def change
    create_table :event_logs, id: :uuid do |t|
      t.uuid :community_id
      t.uuid :acting_user_id
      t.uuid :ref_id
      t.string :ref_type
      t.string :subject
      t.json :data
      t.datetime :created_at
    end
    add_index :event_logs, :ref_id
  end
end
