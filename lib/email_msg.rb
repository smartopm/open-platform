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

  def self.messages_from_sendgrid
    sg_client = SendGrid::API.new(api_key: Rails.application.credentials[:sendgrid_api_key]).client
    # Find a way to make limit and offset dynamic
    params = JSON.parse('{"limit": 100 }')
    response = sg_client.messages.get(query_params: params)
    emails = JSON.parse(response.body)
    emails['messages']
  end

  # other stuff ==> message body
  # is_open ==> is_read
  # msg_id ==> source_system_id
  # type ==> email || sms
  # sender_id ==> findByEmail from Mutale.
  # pass community name and find id based on that.
  # loop through all messages coming from the API and find respective users based on their emails

  def self.find_user(email, community_id)
    user = User.find_by(email: email, community_id: community_id)
    return if user.nil?

    user
  end

  def self.find_community(name)
    community = Community.find_by(name: name)
    return if community.nil?

    community
  end

  # msg_id here === source_system_id 
  def self.message_exists?(msg_id, id)
    message = Message.find_by(source_system_id: msg_id, user_id: id)
    return true unless message.nil?

    false
  end

  # call this method from message model with the community_id
  # We can also add this to the scheduler as well if we have community_id
  # rubocop:disable Metrics/MethodLength
  def self.save_sendgrid_messages(community_name)
    comm = find_community(community_name)
    puts comm.id
    emails = messages_from_sendgrid
    # replace this with Mutale's email
    # add more validation to make sure users exist before saving that user.
    sender = find_user('olivier@doublegdp.coma', comm.id) # Admin's email, static for now
    # puts sender.to_json
    emails.each do |email|
      user = find_user(email['to_email'], comm.id)
      next if user.nil?
      next if message_exists?(email['msg_id'], user.id)

      puts user.name

      message = Message.new(
        is_read: (email['opens_count']).positive?, sender_id: sender.id,
        read_at: email['last_event_time'],
        user_id: user.id,
        message: email['subject'], category: 'email', status: email['status'],
        source_system_id: email['msg_id']
      )
      message.save! # add ! later to validate user existance before saving the message
    end
  end
  # rubocop:enable Metrics/MethodLength
end
# rubocop:enable Metrics/AbcSize
