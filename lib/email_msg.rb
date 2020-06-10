# frozen_string_literal: true

require 'sendgrid-ruby'
require 'uri'
require 'json'
require 'erb'

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

  # rubocop:disable Metrics/MethodLength
  def self.messages_from_sendgrid
    return if Rails.env.test?

    start_date = ERB::Util.url_encode(DateTime.now.to_s)
    past_date = DateTime.now - 3.days
    end_date = ERB::Util.url_encode(past_date.to_s)

    # rubocop:disable Metrics/LineLength
    url = URI("https://api.sendgrid.com/v3/messages?limit=2000&query=last_event_time%20BETWEEN%20TIMESTAMP%20%22#{end_date}%22%20AND%20TIMESTAMP%20%22#{start_date}%22'")
    # rubocop:enable Metrics/LineLength
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    request = Net::HTTP::Get.new(url)
    request['authorization'] = "Bearer #{Rails.application.credentials[:sendgrid_api_key]}"
    request.body = '{}'
    response = http.request(request)
    response.read_body
    emails = JSON.parse(response.read_body)
    emails['messages']
  end
  # rubocop:enable Metrics/MethodLength

  # other stuff ==> message body
  # is_open ==> is_read
  # msg_id ==> source_system_id
  # type ==> email || sms
  # sender_id ==> findByEmail from Mutale.
  # pass community name and find id based on that.
  # loop through all messages coming from the API and find respective users based on their emails

  def self.find_user(email, name)
    community = Community.find_by(name: name)
    return if community.nil?

    user = community.users.find_by(email: email)
    user
  end

  # msg_id here === source_system_id
  def self.message_exists?(msg_id, id)
    message = Message.find_by(source_system_id: msg_id, user_id: id)
    return true unless message.nil?

    false
  end

  # passing the email here to allow testing with generated emails
  def self.fetch_emails(name)
    emails = messages_from_sendgrid
    save_sendgrid_messages(name, emails, 'oliver@doublegdp.com')
  end

  # call this method from message model with the community_id
  # We can also add this to the scheduler as well if we have community_id
  # rubocop:disable Metrics/MethodLength
  def self.save_sendgrid_messages(community_name, emails, sender_email)
    # replace this with Mutale's email
    # add more validation to make sure users exist before saving that user.
    sender = find_user(sender_email, community_name) # Admin's email, static for now
    emails.each do |email|
      user = find_user(email['to_email'], community_name)
      next if user.nil?
      next if message_exists?(email['msg_id'], user.id)

      message = Message.new(
        is_read: (email['opens_count']).positive?, sender_id: sender.id,
        read_at: email['last_event_time'],
        user_id: user.id,
        created_at: email['last_event_time'],
        message: email['subject'], category: 'email', status: email['status'],
        source_system_id: email['msg_id']
      )
      message.save!
    end
  end
  # rubocop:enable Metrics/MethodLength
end
# rubocop:enable Metrics/AbcSize
