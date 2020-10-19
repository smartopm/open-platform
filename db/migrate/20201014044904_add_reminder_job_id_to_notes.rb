class AddReminderJobIdToNotes < ActiveRecord::Migration[6.0]
  def change
    add_column :notes, :reminder_job_id, :string
  end
end
