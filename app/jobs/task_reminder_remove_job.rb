# frozen_string_literal: true

# Remove reminder job ID for the corresponding task
class TaskReminderRemoveJob < ApplicationJob
  queue_as :default

  def perform(note)
    Sidekiq::ScheduledSet.new.find_job(note.reminder_job_id)&.delete
    note.update!(reminder_job_id: nil)
  end
end
