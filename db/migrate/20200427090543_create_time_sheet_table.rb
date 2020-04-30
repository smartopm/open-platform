class CreateTimeSheetTable < ActiveRecord::Migration[6.0]
  def change
    create_table :time_sheets, id: :uuid do |t|
      t.uuid :shift_start_event_log_id
      t.uuid :shift_end_event_log_id
      t.uuid :user_id
      t.datetime :started_at
      t.datetime :ended_at

      t.timestamps
    end
    add_index :time_sheets, [:shift_start_event_log_id]
    add_index :time_sheets, [:shift_end_event_log_id]
    add_index :time_sheets, [:user_id]
  end
end
