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

  # rubocop:disable Lint/SuppressedException
  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def self.send(to, message, _community)
    raise SmsError, I18n.t('errors.user.cannot_send_message') if to.blank?

    return if Rails.env.test?

    to = clean_number(to)
    client = Vonage::Client.new(api_key: config[:api_key], api_secret: config[:api_secret])
    twilio_client = Twilio::REST::Client.new(
      Rails.application.credentials.twilio_account_sid,
      Rails.application.credentials.twilio_token,
    )

    # We temporarily removed the validation of numbers as it wasn't working well for CM
    # We are also suppressing the error since invalid numbers throw an error with new gem
    begin
      # TODO: We need to allow alphanumeric codes to be sent to US numers
      # This is an urgent fix and this will be resolved properly
      # client.sms.send(from: 'DoubleGDP', to: to, text: message)
      client.sms.send(from: config[:from], to: to, text: message)
      twilio_client.messages.create(
        to: "whatsapp:+#{to}",
        from: 'whatsapp:+14155238886',
        body: message,
      )
    rescue StandardError
    end
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize
  # rubocop:enable Lint/SuppressedException

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
end
