# frozen_string_literal: true

require 'json'
require 'net/http'

# fetch and save tags from wordpress
class CommunityPostTagsJob < ApplicationJob
  queue_as :default

  def perform(community_name)
    community = Community.find_by(name: community_name)
    return if community.blank?

    tags = fetch_wordpress_tags
    tags.each do |tag|
      community.post_tags.create!(name: tag['name'], slug: tag['slug'])
    rescue StandardError => e
      Rails.logger.info e
      next
    end
  end

  def fetch_wordpress_tags
    wp_link = 'https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com/tags'

    url = URI("#{wp_link}/")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER
    request = Net::HTTP::Get.new(url)
    request.body = '{}'
    response = http.request(request)
    res = JSON.parse(response.read_body)
    res['tags']
  end
end
