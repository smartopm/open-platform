# frozen_string_literal: true
require 'email_msg'
require 'host_env'

module Notes
  # AssigneeNote
  class AssigneeNote < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'
    belongs_to :note

    after_create :notify_user
    after_update :notify_user, if: proc { saved_change_to_user_id? }

    private

    def notify_user
      send_email_from_db
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    def send_email_from_db
      template = user.community
                     .email_templates
                    &.system_emails
                    &.find_by(name: 'notification_template')

      return unless template

      template_data = [
        { key: '%logo_url%', value: user.community&.logo_url.to_s },
        { key: '%community%', value: user.community&.name.to_s },
        { key: '%url%', value: "#{HostEnv.base_url(user.community)}/tasks/#{note.id}" },
      ]
      EmailMsg.send_mail_from_db(user.email, template, template_data)
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength
  end
end
