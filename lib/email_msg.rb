# frozen_string_literal: true

require 'sendgrid-ruby'
require 'json'

# class helper to help send emails to doublegdp users using sendgrid
class EmailMsg
  include SendGrid

  class UninitializedError < StandardError; end
  class EmailMsgError < StandardError; end

  def self.send_welcome_msg(user_email, name)
    raise EmailMsgError, 'Email must be provided' if user_email.blank?

    client = SendGrid::API.new(api_key: Rails.application.credentials[:sendgrid_api_key]).client
    mail = SendGrid::Mail.new
    mail.from = SendGrid::Email.new(email: 'olivier@doublegdp.com')
    personalization = Personalization.new
    personalization.add_to(SendGrid::Email.new(email: user_email))
    personalization.add_dynamic_template_data("community": 'Nkwashi Community', "name": name)
    mail.add_personalization(personalization)
    mail.template_id = Rails.application.credentials[:sendgrid_template_id]
    client.mail._('send').post(request_body: mail.to_json)
  end
end
