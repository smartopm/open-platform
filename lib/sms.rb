# frozen_string_literal: true

require 'nexmo'

# Library to initialize and send SMS messages using Nexmo/Twilio
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

  def self.send(to, message)
    raise SmsError, '`to` can\'t be nil or empty' if to.blank?

    return if Rails.env.test?

    to = clean_number(to)
    client = Nexmo::Client.new(api_key: config[:api_key], api_secret: config[:api_secret])
    client.sms.send(from: config[:from], to: to, text: message)
  end

  def self.send_from(to, from, message)
    raise SmsError, '`to` can\'t be nil or empty' if to.blank?

    return if Rails.env.test?

    to = clean_number(to)
    client = Nexmo::Client.new(api_key: config[:api_key], api_secret: config[:api_secret])
    client.sms.send(from: from, to: to, text: message)
  end

  def self.send_to_many(recipients, message)
    raise SmsError, '`to` can\'t be nil or empty' if recipients.empty?

    return if Rails.env.test?

    # This is likely to be resource intensive
    recipients.each do |user|
      to = clean_number(user)
      client = Nexmo::Client.new(api_key: config[:api_key], api_secret: config[:api_secret])
      client.sms.send(to: to, text: message)
    end
  end

  # Ensure that we give Nexmo a properly formatted number
  # Strip anything that's not a number
  # Ex '+260 971501212' => '260971501212'
  def self.clean_number(phone_number)
    phone_number.gsub(/[^0-9]/, '')
  end
end
