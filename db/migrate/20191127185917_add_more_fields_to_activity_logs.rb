class AddMoreFieldsToActivityLogs < ActiveRecord::Migration[6.0]
  def change
    add_column :activity_logs, :activity_type, :string, default: "entry"
    add_column :activity_logs, :data, :json
  end
end
