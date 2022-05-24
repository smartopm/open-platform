# frozen_string_literal: true

namespace :db do
  desc 'Create default discussion topics for existing communities'
  task create_discussion_topics: :environment do
    puts 'Starting creating discussion topics ...'

    DISCUSSION_TOPICS = ['Safety', 'Events', 'Recommendations', 'Items for Sale', 'Family'].freeze
    id = Users::User.find_by(email: 'nicolas@doublegdp.com').id

    ActiveRecord::Base.transaction do
      Community.find_each do |community|
        puts "Creating discussions for #{community.name}..."

        DISCUSSION_TOPICS.each do |topic|
          unless community.discussions.find_by(title: topic)
            community.discussions.create!(title: topic, user_id: id)
          end
        end
      end
    end
    puts 'Created discussion topics.'
  rescue StandardError => e
    puts 'Failed to create discussion topics for community'
    puts e.message.to_s
  end
end
