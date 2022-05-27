# frozen_string_literal: true

namespace :db do
  desc 'Create default discussion topics for existing communities'
  task create_discussion_topics: :environment do
    puts 'Starting creating system discussion topics ...'

    # store keys of system generated discussion topics
    DISCUSSION_TOPICS = %w[safety events recommendations items_for_sale family].freeze

    ActiveRecord::Base.transaction do
      Community.find_each do |community|
        puts "Creating system discussions for #{community.name}..."

        # remove last MR created system discussions, since values are stored earlier
        community.discussions.system&.delete_all

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
