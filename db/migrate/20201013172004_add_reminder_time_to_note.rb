class AddReminderTimeToNote < ActiveRecord::Migration[6.0]
  def change
    add_column :notes, :reminder_time, :datetime
  end
end
