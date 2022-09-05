# frozen_string_literal: true

require 'vonage'

# Library to initialize and send SMS messages using Vonage/Twilio
class Sms
  class UninitializedError < StandardError; end
  class SmsError < StandardError; end

  @config = {}
  class << self
    attr_accessor :config
  end

  def self.setup
    yield config
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def self.send(to, message, community, type = 'sms')
    sender = from(community)
    raise SmsError, I18n.t('errors.user.cannot_send_message') if to.blank?

    return if Rails.env.test?

    to = clean_number(to)
    client = Vonage::Client.new(api_key: config[:api_key], api_secret: config[:api_secret])
    twilio_client = Twilio::REST::Client.new(
      ENV['TWILIO_ACCOUNT_SID'],
      ENV['TWILIO_TOKEN'],
    )

    # We temporarily removed the validation of numbers as it wasn't working well for CM
    # We are also suppressing the error since invalid numbers throw an error with new gem
    begin
      # TODO: We need to allow alphanumeric codes to be sent to US numers
      # This is an urgent fix and this will be resolved properly
      # client.sms.send(from: 'DoubleGDP', to: to, text: message)
      client.sms.send(from: config[:from], to: to, text: message) unless type.eql?('whatsapp')
      unless sender.nil?
        twilio_client.messages.create(
          to: "whatsapp:+#{to}",
          from: "whatsapp:+#{from(community)}",
          body: message,
        )
      end
    rescue StandardError => e
      Rollbar.error(e)
    end
  end

  def self.send_whatsapp_message(to, community, media_url, message = '')
    sender = from(community)
    return if sender.nil?

    twilio_client = Twilio::REST::Client.new(
      ENV['TWILIO_ACCOUNT_SID'],
      ENV['TWILIO_TOKEN'],
    )
    begin
      twilio_client.messages.create(
        to: "whatsapp:+#{to}",
        from: "whatsapp:+#{from(community)}",
        body: message,
        media_url: media_url,
      )
    rescue StandardError => e
      Rollbar.error(e)
    end
  end

  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize
  def self.send_from(to, from, message)
    raise SmsError, I18n.t('errors.user.cannot_send_message') if to.blank?

    return if Rails.env.test?

    to = clean_number(to)
    client = Vonage::Client.new(api_key: config[:api_key], api_secret: config[:api_secret])
    client.sms.send(from: from, to: to, text: message)
  end

  # Ensure that we give Vonage a properly formatted number
  # Strip anything that's not a number
  # Ex '+260 971501212' => '260971501212'
  def self.clean_number(phone_number)
    phone_number.gsub(/[^0-9]/, '')
  end

  def self.from(community)
    community.support_whatsapp&.map do |data|
      data['whatsapp'] if data['category'].eql?('communication')
    end&.first
  end
end
