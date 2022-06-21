# frozen_string_literal: true

require 'net/http'
require 'uri'

# flutterwave charger
class FlutterwaveCharger
  def self.generate_link(payload, community_id)
    url = URI('https://api.flutterwave.com/v3/payments')
    http = generate_http(url)
    request = Net::HTTP::Post.new(url)
    request['Authorization'] = auth_key(community_id)
    request['Content-Type'] = 'application/json'
    request.body = payload.to_json
    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def self.verify_transaction(transaction_id, community_id)
    url = URI("https://api.flutterwave.com/v3/transactions/#{transaction_id}/verify")
    http = generate_http(url)
    request = Net::HTTP::Get.new(url)
    request['Authorization'] = auth_key(community_id)
    request['Content-Type'] = 'application/json'
    response = http.request(request)
    JSON.parse(response.read_body)
  end

  def self.generate_http(url)
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER
    http
  end

  def self.auth_key(community_id)
    community_name = Community.find_by(id: community_id).name
    key = JSON.parse(ENV["#{community_name.parameterize.underscore.upcase}_FLUTTERWAVE"])
    "Bearer #{key['PRIVATE_KEY']}"
  end
end
