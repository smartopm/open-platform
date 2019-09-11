# frozen_string_literal: true

require 'nexmo'

# Library to initialize and send SMS messages using Nexmo/Twilio
class Sms
  class UninitializedError < StandardError; end

  @config = {}
  class << self
    attr_accessor :config
  end

  def self.setup
    yield config
  end

  def self.send(to, message)
    client = Nexmo::Client.new(api_key: config[:api_key], api_secret: config[:api_secret])
    client.sms.send(from: config[:from], to: to, text: message)
  end

  def self.send_from(to, from, message)
    client = Nexmo::Client.new(api_key: config[:api_key], api_secret: config[:api_secret])
    client.sms.send(from: from, to: to, text: message)
  end
end
