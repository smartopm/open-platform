# frozen_string_literal: true

require 'nokogiri'
require 'json'
require 'net/http'
require 'email_msg'
require 'host_env'

# alert user if there is new posts related to the the tag a user is subscribed to
class PostTagsAlertJob < ApplicationJob
  queue_as :default
  # rubocop:disable Metrics/MethodLength
  def perform(comm_name)
    return unless Rails.env.production?

    comm = Community.find_by(name: comm_name)
    comm.users.find_each do |user|
      # check if there is a new post for this post
      user.post_tags.each do |tag|
        post_ids = scrape(tag.slug)
        pub_date = post_published_date(post_ids[0])
        next send_email_from_db(user.email, post_ids[0], comm) if published_today?(pub_date)
      end
    end
  end

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
    return if date.nil?

    date > Time.zone.now.beginning_of_day
  end

  def send_email_from_db(email, post_id, community)
    template = community.email_templates
                    &.system_emails
                    &.find_by(name: 'post_alert_template')
    return unless template

    template_data = [
      { key: '%logo_url%', value: community&.logo_url.to_s },
      { key: '%community%', value: community&.name.to_s },
      { key: '%post_url%', value: "https://#{HostEnv.base_url(community)}/news/post/#{post_id}" },
    ]
    EmailMsg.send_mail_from_db(
      email: email,
      template: template,
      template_data: template_data,
    )
  end
  # rubocop:enable Metrics/MethodLength
end
