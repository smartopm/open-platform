class CreateSubstatusLogs < ActiveRecord::Migration[6.0]
  def change
    create_table :substatus_logs, id: :uuid do |t|
      t.datetime :start_date
      t.datetime :stop_date
      t.string :previous_status
      t.string :new_status
      t.references :community, null: false, type: :uuid, foreign_key: true
      t.references :user, null: false, type: :uuid, foreign_key: true

      t.timestamps
    end
  end
end
