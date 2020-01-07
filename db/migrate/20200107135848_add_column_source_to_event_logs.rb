class AddColumnSourceToEventLogs < ActiveRecord::Migration[6.0]
  def change
    add_column :entry_requests, :source, :string
  end
end
