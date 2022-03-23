# frozen_string_literal: true

require 'host_env'

module Logs
  # User Import Log
  class ImportLog < ApplicationRecord
    belongs_to :community
    belongs_to :user, class_name: 'Users::User'

    validates :file_name, presence: true

    after_create :send_import_status_email

    private

    # rubocop:disable Metrics/MethodLength
    def send_import_status_email
      template = community.email_templates.find_by(name: 'user_import')
      return unless template

      message = if failed
                  import_error_message(import_errors)
                else
                  'All users have been created successfully.'
                end

      template_data = [
        { key: '%message%', value: message },
        { key: '%app_url%', value: "#{HostEnv.base_url(community)}/" },
      ]
      EmailMsg.send_mail_from_db(
        email: user.email,
        template: template,
        template_data: template_data,
      )
    end
    # rubocop:enable Metrics/MethodLength

    def import_error_message(user_import_errors)
      message_string = 'The following errors occurred: <br><br>'
      JSON.parse(user_import_errors).first(100).each do |row, errors|
        message_string += "Row #{row}: <br>"
        errors.each do |err|
          message_string += "&nbsp; #{err} <br>"
        end
      end

      message_string += '<br>Fix the errors and try again.'
      message_string
    end
  end
end
