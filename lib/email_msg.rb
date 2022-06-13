# frozen_string_literal: true

require 'sendgrid-ruby'
require 'erb'
require 'uri'
require 'net/http'

# class helper to help send emails to doublegdp users using sendgrid
# rubocop: disable Metrics/ClassLength
class EmailMsg
  include SendGrid

  class UninitializedError < StandardError; end
  class EmailMsgError < StandardError; end

  # disabling rubocop till I find a better to lighten this method
  # rubocop:disable Metrics/AbcSize
  def self.send_mail(user_email, template_id, template_data = {})
    return if Rails.env.test?
    raise EmailMsgError, 'Email must be provided' if user_email.blank?

    mail = SendGrid::Mail.new
    mail.from = SendGrid::Email.new(email: 'support@doublegdp.com')
    personalization = Personalization.new
    personalization.add_to(SendGrid::Email.new(email: user_email))
    personalization.add_dynamic_template_data(template_data)
    mail.add_personalization(personalization)
    mail.template_id = template_id
    client.mail._('send').post(request_body: mail.to_json)
  end
  # rubocop:enable Metrics/AbcSize

  # We should rename this to send_mail by the time we get rid of the send_mail() above
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Metrics/CyclomaticComplexity
  def self.send_mail_from_db(**args)
    return if Rails.env.test?

    email = args[:email]
    template = args[:template]
    template_data = args[:template_data] || []
    email_subject = args[:email_subject]
    custom_key = args[:custom_key]
    custom_value = args[:custom_value]
    raise EmailMsgError, 'Email & Template must be provided' if email.blank? || template.blank?

    sg_mail = SendGrid::Mail.new
    sg_mail.from = SendGrid::Email.new(email: 'support@doublegdp.com')
    personalization = Personalization.new
    personalization.add_to(SendGrid::Email.new(email: email))
    template_data.each { |data| personalization.add_substitution(Substitution.new(data)) }
    personalization.subject = email_subject || template.subject
    sg_mail.add_personalization(personalization)
    sg_mail.add_content(Content.new(type: 'text/html', value: template.body))
    add_custom_args(sg_mail, custom_key, custom_value) if custom_args?(custom_key, custom_value)
    client.mail._('send').post(request_body: sg_mail.to_json)
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/CyclomaticComplexity

  def self.add_custom_args(sg_mail, custom_key, custom_value)
    sg_mail.add_custom_arg(CustomArg.new(key: custom_key, value: custom_value))
  end

  def self.custom_args?(custom_key, custom_value)
    custom_key.present? && custom_value.present?
  end

  def self.sendgrid_api(api_link)
    url = URI(api_link)
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER
    request = Net::HTTP::Get.new(url)
    request['authorization'] = "Bearer #{Rails.application.credentials[:sendgrid_updated_api_key]}"
    request.body = '{}'
    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def self.fetch_unsubscribes_list(start_time)
    return if Rails.env.test?

    end_time = Time.zone.now.to_i
    # rubocop:disable Layout/LineLength
    sendgrid_api("https://api.sendgrid.com/v3/suppression/unsubscribes?start_time=#{start_time}&end_time=#{end_time}")
    # rubocop:enable Layout/LineLength
  end

  def self.messages_from_sendgrid(date_from = nil)
    return if Rails.env.test?

    past_date = DateTime.now - 3.days
    end_date = ERB::Util.url_encode(past_date.to_s)
    date_from_e = date_from.nil? ? end_date : ERB::Util.url_encode(date_from)
    start_date = ERB::Util.url_encode(DateTime.now.to_s)

    # rubocop:disable Layout/LineLength
    url = URI("https://api.sendgrid.com/v3/messages?limit=2000&query=last_event_time%20BETWEEN%20TIMESTAMP%20%22#{date_from_e}%22%20AND%20TIMESTAMP%20%22#{start_date}%22'")
    # rubocop:enable Layout/LineLength
    response = sendgrid_api(url)
    response['messages']
  end

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

    community.users.find_by(email: email)
  end

  # msg_id here === source_system_id
  def self.message_exists?(msg_id, id)
    message = Notifications::Message.find_by(source_system_id: msg_id, user_id: id)
    return true unless message.nil?

    false
  end

  # passing the email here to allow testing with generated emails
  def self.fetch_emails(name, date_from)
    emails = messages_from_sendgrid(date_from)
    save_sendgrid_messages(name, emails, 'mutale@doublegdp.com')
  end

  # attempt to synchronize
  def self.message_update?(email)
    message = Notifications::Message.find_by(source_system_id: email['msg_id'])
    return if message.nil?

    # we could override the activerecord timestamp by setting updated_at to last_event_time
    message.update(
      is_read: (email['opens_count']).positive?,
      read_at: email['last_event_time'],
    )
  end

  def self.client
    @client ||= SendGrid::API.new(
      api_key: Rails.application.credentials[:sendgrid_updated_api_key],
    ).client
  end

  # call this method from message model with the community_id
  # We can also add this to the scheduler as well if we have community_id
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def self.save_sendgrid_messages(community_name, emails, sender_email)
    # replace this with Mutale's email
    # add more validation to make sure users exist before saving that user.
    sender = find_user(sender_email, community_name) # Admin's email, static for now
    emails.each do |email|
      user = find_user(email['to_email'], community_name)
      next if user.nil?

      if message_exists?(email['msg_id'], user.id)
        message_update?(email)
        next
      end

      message = Notifications::Message.new(
        is_read: (email['opens_count']).positive?, sender_id: sender.id,
        read_at: (email['opens_count']).positive? ? email['last_event_time'] : nil,
        user_id: user.id,
        created_at: email['last_event_time'],
        message: email['subject'], category: 'email', status: email['status'],
        source_system_id: email['msg_id']
      )
      message.save!
    end
  end

  def self.email_stats(key, value)
    sg = SendGrid::API.new(api_key: Rails.application.credentials[:sendgrid_updated_api_key].to_s)

    response = sg.client.messages.get(query_params: query_params(key, value))
    JSON.parse(response.body.presence || '{}')['messages']
  end

  def self.query_params(key, value)
    filter_key = "unique_args['#{key}']"
    filter_operator = '='
    filter_value = "'#{value}'"
    params = {}
    params['query'] = "#{filter_key}#{filter_operator}#{filter_value}"
    params['limit'] = '1000'
    params
  end
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Metrics/MethodLength
end
# rubocop: enable Metrics/ClassLength
