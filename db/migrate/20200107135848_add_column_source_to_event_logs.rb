class AddColumnSourceToEventLogs < ActiveRecord::Migration[6.0]
  def change
    add_column :event_logs, :source, :string
  end
end
