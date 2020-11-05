# frozen_string_literal: true

# Update task reminder job and the corresponding note
class TaskReminderUpdateJob < ApplicationJob
  queue_as :default

  def perform(note_id, new_job_id)
    note = Note.find(note_id)
    Sidekiq::ScheduledSet.new.find_job(note.reminder_job_id)&.delete
    note.update!(reminder_job_id: new_job_id)
  end
end
