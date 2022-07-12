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

  # rubocop:disable Metrics/AbcSize
  # rubocop:disable Lint/SuppressedException
  def self.send(to, message, community)
    raise SmsError, I18n.t('errors.user.cannot_send_message') if to.blank?

    return if Rails.env.test?

    to = clean_number(to)
    country = community.locale&.split('-')
    client = Vonage::Client.new(api_key: config[:api_key], api_secret: config[:api_secret])

    begin
      insight = client.number_insight.advanced(number: to, country: country[1])
      client.sms.send(from: 'DoubleGDP', to: to, text: message) if insight.valid_number == 'valid'
    rescue StandardError
    end
  end
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
