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
  def self.send(to, message, _community)
    raise SmsError, I18n.t('errors.user.cannot_send_message') if to.blank?

    return if Rails.env.test?

    to = clean_number(to)
    client = Vonage::Client.new(api_key: config[:api_key], api_secret: config[:api_secret])

    # We temporarily removed the validation of numbers as it wasn't working well for CM
    # We are also suppressing the error since invalid numbers throw an error with new gem
    begin
      client.sms.send(from: 'DoubleGDP', to: to, text: message)
    rescue StandardError
    end
  end
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
