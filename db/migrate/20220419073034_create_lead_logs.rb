class CreateLeadLogs < ActiveRecord::Migration[6.1]
  def change
    create_table :lead_logs, id: :uuid do |t|
      t.string :name
      t.integer :log_type
      t.uuid :acting_user_id
      t.references :community, null: false, foreign_key: true, type: :uuid
      t.references :user, null: false, foreign_key: true, type: :uuid

      t.timestamps
    end
  end
end
