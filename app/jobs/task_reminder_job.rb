# frozen_string_literal: true

# Send a task reminder
class TaskReminderJob < ApplicationJob
  queue_as :default

  def perform(note_id, user_id)
    return unless Rails.env.production?

    user = User.find(user_id)
    note = Note.find(note_id)

    template_id = user.community.templates&.dig('task_reminder_template_id')
    return unless template_id

    # EmailMsg.send_mail(user.email, template_id, 'url': ENV['HOST'])
  end
end
