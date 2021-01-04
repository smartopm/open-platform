# frozen_string_literal: true

require 'nokogiri'
require 'json'
require 'net/http'
require 'email_msg'

# alert user if there is new posts related to the the tag a user is subscribed to
class PostTagsAlertJob < ApplicationJob
  queue_as :default
  # rubocop:disable  Metrics/AbcSize
  def perform(comm_name)
    return unless Rails.env.production?

    comm = Community.find_by(name: comm_name)
    temp_id = comm.templates['post_alert_template_id']
    comm.users.find_each do |user|
      # check if there is a new post for this post
      user.post_tags.each do |tag|
        post_ids = scrape(tag.slug)
        pub_date = post_published_date(post_ids[0])
        next send_email(user.email, post_ids[0], comm_name, temp_id) if published_today?(pub_date)
      end
    end
  end
  # rubocop:enable  Metrics/AbcSize

  private

  # look for all post related a tag and return the newest post
  # posts are published everyday so it is unlikely to have multiple post of same tag in a day.
  def scrape(tag)
    url = "https://doublegdp.wpcomstaging.com/tag/#{tag}/"
    html = URI.open(url)
    content = Nokogiri::HTML(html)
    content.css('[id^=post]').map do |post_container|
      # each post article contains an post id in this form "post-post_id" e.g: post-901
      article = post_container['id']
      # get title of the article
      post_id = article.split('-')[1]
      post_id
    end
  end

  def post_published_date(post_id)
    wp_link = 'https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com/posts'

    url = URI("#{wp_link}/#{post_id}/")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_PEER
    request = Net::HTTP::Get.new(url)
    request.body = '{}'
    response = http.request(request)
    res = JSON.parse(response.read_body)
    res['date']
  end

  def published_today?(date)
    date > Time.zone.now.beginning_of_day
  end

  def send_email(email, post_id, community_name, template)
    EmailMsg.send_mail(email, template, mail_data(post_id, community_name))
  end

  def mail_data(post_id, community_name)
    {
      "post_id": post_id,
      "community_name": community_name,
    }
  end
end
