class AddReminderTimeAndReminderJobIdToAssigneeNotes < ActiveRecord::Migration[6.0]
  def change
    add_column :assignee_notes, :reminder_time, :datetime
    add_column :assignee_notes, :reminder_job_id, :string
  end
end
