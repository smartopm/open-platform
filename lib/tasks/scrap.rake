# frozen_string_literal: true

require 'post_scraper'

desc 'scrap post details'
task scrap: :environment do
  puts 'scrapping ....'
  PostScraper.check_post
end
