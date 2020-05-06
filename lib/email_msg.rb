# frozen_string_literal: true

# d-bec0f1bd39f240d98a146faa4d7c5235

require 'sendgrid-ruby'
require 'json'

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
    personalization.add_dynamic_template_data(
      "community": 'Nkwashi Community', "name": name
    )
    mail.add_personalization(personalization)
    mail.template_id = 'd-bec0f1bd39f240d98a146faa4d7c5235'
    client.mail._('send').post(request_body: mail.to_json)
  end
end
