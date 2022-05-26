# frozen_string_literal: true

namespace :db do
  desc 'Create default discussion topics for existing communities'
  task create_discussion_topics: :environment do
    puts 'Starting creating system discussion topics ...'

    DISCUSSION_TOPICS = [
      I18n.t('discussion_title.safety'),
      I18n.t('discussion_title.events'),
      I18n.t('discussion_title.recommendations'),
      I18n.t('discussion_title.items_for_sale'),
      I18n.t('discussion_title.family'),
    ].freeze

    ActiveRecord::Base.transaction do
      Community.find_each do |community|
        puts "Creating system discussions for #{community.name}..."
        id = community.sub_administrator_id || community.users
                                                        .find_by(email: 'nicolas@doublegdp.com')&.id

        DISCUSSION_TOPICS.each do |topic|
          community.discussions.find_or_create_by!(title: topic, user_id: id, tag: 'system')
        end
      end
    end
    puts 'Created system discussion topics.'
  rescue StandardError => e
    puts 'Failed to create discussion topics for community'
    puts e.message.to_s
  end
end
