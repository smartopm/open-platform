class AddUpdatedByToSubstatusLogs < ActiveRecord::Migration[6.0]
  def change
    add_reference :substatus_logs, :updated_by, type: :uuid, foreign_key: { to_table: :users }
  end
end
