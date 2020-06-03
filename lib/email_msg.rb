# frozen_string_literal: true

require 'sendgrid-ruby'
require 'json'

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
    mail.template_id = 'd-bec0f1bd39f240d98a146faa4d7c5235'
    client.mail._('send').post(request_body: mail.to_json)
  end
  # rubocop:enable Metrics/AbcSize

  def self.messages_from_sendgrid
    url = URI("https://api.sendgrid.com/v3/messages?limit=10")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE

    request = Net::HTTP::Get.new(url)
    request["authorization"] = "Bearer #{Rails.application.credentials[:sendgrid_api_key]}"
    request.body = "{}"

    response = http.request(request)
    response.read_body
  end

  # other stuff ==> message body
   # is_open ==> is_read
   # msg_id ==> source_system_id
   # type ==> email || sms
   # sender_id ==> findByEmail from Mutale.
   # loop through all messages coming from the API and find respective users based on their emails

   def self.find_by_email(email)
     User.find_by(email: email)
     # this is comment
   end

   def self.save_sendgrid_messages
     emails  = messages_from_sendgrid()
     # puts messages.to_hash
     mess = JSON.parse(emails)
     messages = mess['messages']
     # replace this with Mutale's email
     sender = User.find_by_email('olivier@doublegdp.com')
     puts "============================"
     messages.each do |message|
        user = find_by_email(message['to_email'])
        message = Message.new(
          is_read: message['opens_count'] > 0 ? true : false,
          sender_id: sender.id,
          user_id: user.nil? ? SecureRandom.uuid : user.id,
          message: "#{message['subject']}",
          type: 'email',
          status: message['status'],
          source_system_id: message['msg_id']
        )
        message.save
        puts message['to_email']
        puts user.to_json
      end
   end
end
