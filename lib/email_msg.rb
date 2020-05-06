# frozen_string_literal: true

require 'sendgrid-ruby'

# class helper to help send emails to doublegdp users using sendgrid
class EmailMsg
  include SendGrid

  class UninitializedError < StandardError; end
  class EmailMsgError < StandardError; end

  # disabling rubocop till I find a better to lighten this method
  # rubocop:disable Metrics/AbcSize
  def self.send_welcome_msg(user_email, name, community)
    raise EmailMsgError, 'Email must be provided' if user_email.blank?

    client = SendGrid::API.new(api_key: Rails.application.credentials[:sendgrid_api_key]).client
    mail = SendGrid::Mail.new
    mail.from = SendGrid::Email.new(email: 'support@doublegdp.com')
    personalization = Personalization.new
    personalization.add_to(SendGrid::Email.new(email: user_email))
    personalization.add_dynamic_template_data("community": community, "name": name)
    mail.add_personalization(personalization)
    mail.template_id = "d-bec0f1bd39f240d98a146faa4d7c5235"
    client.mail._('send').post(request_body: mail.to_json)
  end
  # rubocop:enable Metrics/AbcSize
end
