class CreateEntryRequests < ActiveRecord::Migration[6.0]
  def change
    create_table :entry_requests, id: :uuid do |t|
      t.uuid :user_id
      t.uuid :community_id
      t.string :name
      t.string :nrc
      t.string :phone_number
      t.string :vehicle_plate
      t.string :reason
      t.string :other_reason
      t.boolean :concern_flag
      t.integer :granted_state
      t.uuid :grantor_id
      t.datetime :granted_at

      t.timestamps
    end
  end
end
