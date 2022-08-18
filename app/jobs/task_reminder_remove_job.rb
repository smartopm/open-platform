# frozen_string_literal: true

# Remove reminder job ID for the corresponding task
class TaskReminderRemoveJob < ApplicationJob
  queue_as :default

  def perform(assigned_note_id)
    assigned_note = Notes::AssigneeNote.find_by(id: assigned_note_id)
    return if assigned_note.nil?

    Sidekiq::ScheduledSet.new.find_job(assigned_note.reminder_job_id)&.delete
    assigned_note.update!(reminder_job_id: nil)
  end
end
