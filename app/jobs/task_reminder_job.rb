# frozen_string_literal: true

require 'email_msg'

# Send a task reminder by Email after wait time
class TaskReminderJob < ApplicationJob
  queue_as :default

  # rubocop:disable Metrics/MethodLength
  def perform(assigned_note)
    return unless assigned_note

    user = assigned_note.user
    note_id = assigned_note.note_id

    template = user.community
                   .email_templates
                    &.system_emails
                    &.find_by(name: 'task_reminder_template')
    return unless template

    template_data = [
      { key: '%logo_url%', value: user.community&.logo_url.to_s },
      { key: '%community%', value: user.community&.name.to_s },
      { key: '%url%', value: "#{ENV['HOST']}/tasks/#{note_id}" },
    ]
    EmailMsg.send_mail_from_db(user.email, template, template_data)
  end
  # rubocop:enable Metrics/MethodLength
end
