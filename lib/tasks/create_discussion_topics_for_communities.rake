# frozen_string_literal: true

namespace :db do
  desc 'Create default discussion topics for existing communities'
  task create_discussion_topics: :environment do
    puts 'Starting creating system discussion topics ...'

    ActiveRecord::Base.transaction do
      Community.find_each do |community|
        puts "Creating system discussions for #{community.name}..."

        # get current community language locale
        community_locale = (community&.language && community.language[/.*(?=-)|.*/]) || 'en'
        id = community.sub_administrator_id || community.users
                                                        .find_by(email: 'nicolas@doublegdp.com')&.id
        discussion_topics = [
          I18n.t('discussion_title.safety'),
          I18n.t('discussion_title.events'),
          I18n.t('discussion_title.recommendations'),
          I18n.t('discussion_title.items_for_sale'),
          I18n.t('discussion_title.family'),
        ].freeze

        discussion_topics.each do |topic|
          discussion = community.discussions.system.find_by(title: topic)
          translated_topic = I18n.t(
            "discussion_title.#{topic.downcase.tr(' ', '_')}", locale: community_locale
          )

          if discussion
            discussion.update(title: translated_topic)
          else
            community
              .discussions
              .find_or_create_by!(title: translated_topic, user_id: id, tag: 'system')
          end
        end
      end
    end
    puts 'Created system discussion topics.'
  rescue StandardError => e
    puts 'Failed to create discussion topics for community'
    puts e.message.to_s
  end
end
