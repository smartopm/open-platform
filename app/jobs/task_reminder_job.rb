# frozen_string_literal: true

require 'email_msg'
require 'host_env'

# Send a task reminder by Email after wait time
class TaskReminderJob < ApplicationJob
  queue_as :default

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def perform(job_type, assigned_note = nil)
    return if job_type.eql?('manual') && assigned_note.nil?

    if job_type.eql?('manual')
      send_email_reminder(assigned_note)
    else
      return unless Rails.env.production?

      Community.find_each do |community|
        next unless task_reminder_enabled(community)

        community_notes = community.notes.joins(:assignee_notes)
                                   .includes(assignee_notes: :user)
                                   .where(completed: false).distinct
        community_notes.find_each do |note|
          note.assignee_notes.each do |note_assignee|
            send_email_reminder(note_assignee)
            send_sms_reminder(note_assignee)
          end
        end
      end
    end
  end

  def send_email_reminder(assigned_note)
    user = assigned_note.user
    note_id = assigned_note.note_id

    template = user.community
                   .email_templates
                    &.system_emails
                    &.find_by(name: 'task_reminder_template')
    return if template.nil? || user.email.blank?

    template_data = [
      { key: '%logo_url%', value: user.community&.logo_url.to_s },
      { key: '%community%', value: user.community&.name.to_s },
      { key: '%url%', value: "#{HostEnv.base_url(user.community)}/tasks/#{note_id}" },
    ]
    EmailMsg.send_mail_from_db(
      email: user.email,
      template: template,
      template_data: template_data,
    )
  end

  def send_sms_reminder(note_assignee)
    user = note_assignee.user
    number = user.phone_number
    return if number.blank?

    note_id = note_assignee.note_id
    due_date = note_assignee.note.due_date&.to_date.to_s
    task_link = "#{HostEnv.base_url(user.community)}/tasks/#{note_id}"
    Sms.send(number, I18n.t('general.task_reminder', due_date: due_date, task_link: task_link,
                                                     community_name: user.community.name),
                                                     user.community)
  end

  def task_reminder_enabled(community)
    community.features&.dig('Tasks', 'features')&.include?('Automated Task Reminders')
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength
end
