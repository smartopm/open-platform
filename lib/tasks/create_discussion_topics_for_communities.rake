# frozen_string_literal: true

namespace :db do
  desc 'Create default discussion topics for existing communities'
  task create_discussion_topics: :environment do
    puts 'Starting creating system discussion topics ...'

    ActiveRecord::Base.transaction do
      Community.find_each do |community|
        puts "Creating system discussions for #{community.name}..."

        # remove last MR created system discussions, since values are stored earlier
        community.discussions.system&.delete_all
        community_locale = (community&.language && community.language[/.*(?=-)|.*/]) || 'en'
        id = community.sub_administrator_id || community.users
                                                        .find_by(email: 'nicolas@doublegdp.com')&.id
        discussion_topics = [
          I18n.t('discussion_title.safety', locale: community_locale),
          I18n.t('discussion_title.events', locale: community_locale),
          I18n.t('discussion_title.recommendations', locale: community_locale),
          I18n.t('discussion_title.items_for_sale', locale: community_locale),
          I18n.t('discussion_title.family', locale: community_locale),
        ].freeze

        discussion_topics.each do |topic|
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
