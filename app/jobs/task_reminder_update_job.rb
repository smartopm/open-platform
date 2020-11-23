# frozen_string_literal: true

# Update reminder job ID for the corresponding task
class TaskReminderUpdateJob < ApplicationJob
  queue_as :default

  def perform(note, new_job_id)
    Sidekiq::ScheduledSet.new.find_job(note.reminder_job_id)&.delete
    note.update!(reminder_job_id: new_job_id)
  end
end
