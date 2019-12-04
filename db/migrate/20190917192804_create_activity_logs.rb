class CreateActivityLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :activity_logs, id: :uuid do |t|
      t.uuid :member_id
      t.uuid :community_id
      t.text :notes
      t.uuid :reporting_member_id

      t.timestamps
    end
  end
end
