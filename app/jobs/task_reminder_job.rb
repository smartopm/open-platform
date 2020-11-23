# frozen_string_literal: true

# Send a task reminder by Email after wait time
class TaskReminderJob < ApplicationJob
  queue_as :default

  def perform(assigned_note)
    return unless assigned_note

    user = assigned_note.user
    note_id = assigned_note.note_id

    template_id = user.community.templates&.dig('task_reminder_template_id')
    return unless template_id

    EmailMsg.send_mail(user.email, template_id, "url": "#{ENV['HOST']}/tasks/#{note_id}")
  end
end
