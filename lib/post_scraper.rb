# frozen_string_literal: true

require 'open-uri'
require 'nokogiri'
require 'json'
require 'net/http'

# get a list of tags users are subscribed to
# use a scraper to get all posts
# find a post that was published today in that category
# construct a link using the post_id
# send an email to the user using the new link

# class helper to get posts whose tags a user is subscribed to
class PostScraper
  def self.check_post
    # we will get these tags from what the user is subscribed to
    user_tags = %w[artists-in-residence architecture]
    user_tags.each do |tag|
      post_id = scrape(tag)
      published_date = post_detail(post_id)
      return send_email if published_today?(published_date)
    end
  end

  def self.scrape(tag)
    url = "https://doublegdp.wpcomstaging.com/tag/#{tag}/"
    html = URI.open(url)
    content = Nokogiri::HTML(html)
    post_id = ''
    content.css('[id^=post]').each do |post_container|
      # each post article contains an post id in this form "post-post_id" e.g: post-901
      article = post_container['id']
      # get title of the article
      post_id = article.split('-')[1]
    end
    post_id
  end

  def self.post_detail(post_id)
    wp_link = 'https://public-api.wordpress.com/rest/v1.1/sites/doublegdp.wordpress.com/posts'

    url = URI("#{wp_link}/#{post_id}/")
    http = Net::HTTP.new(url.host, url.port)
    http.use_ssl = true
    http.verify_mode = OpenSSL::SSL::VERIFY_NONE
    request = Net::HTTP::Get.new(url)
    request.body = '{}'
    response = http.request(request)
    res = JSON.parse(response.read_body)
    res['date']
  end

  def self.published_today?(date)
    date > Time.zone.now.beginning_of_day
  end

  def self.send_email
    # here we will call a sendgrid helper to send a message to the user
    Rails.logger.info 'heyyy yo, am sending an email to you ...'
  end
end
