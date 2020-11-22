class RemoveReminderTimeAndReminderJobIdFromNote < ActiveRecord::Migration[6.0]
  def change
    remove_column :notes, :reminder_time
    remove_column :notes, :reminder_job_id
  end
end
