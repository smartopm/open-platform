# frozen_string_literal: true

require 'net/http'
require 'uri'
require 'json'

# Library to communicate with slack
class Slack
  class SlackError < StandardError; end

  def initialize(url)
    uri = URI.parse(url)
    @https = Net::HTTP.new(uri.host, uri.port)
    @https.use_ssl = true
    @req = Net::HTTP::Post.new(uri.request_uri, 'Content-Type': 'text/json')
  end

  def send(msg)
    return if Rails.env.test?

    @req.body = msg.to_json
    @https.request(@req)
  end
end
