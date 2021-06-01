# frozen_string_literal: true

require 'email_msg'
require 'host_env'

# Send a task reminder by Email after wait time
class TaskReminderJob < ApplicationJob
  queue_as :default

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
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
      { key: '%url%', value: "#{HostEnv.base_url(user.community)}/tasks/#{note_id}" },
    ]
    EmailMsg.send_mail_from_db(user.email, template, template_data)
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength
end
