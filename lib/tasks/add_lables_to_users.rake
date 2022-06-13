# frozen_string_literal: true

namespace :db do
  desc 'Add labels to users'
  task add_labels_to_users: :environment do
    DEFAULT_PREFERENCE = %w[com_news_sms com_news_email weekly_point_reminder_email].freeze

    ActiveRecord::Base.transaction do
      Community.find_each do |community|
        puts "#{community.name} ..."
        community_user_ids = community.users.pluck(:id)
        DEFAULT_PREFERENCE.each do |name|
          label = community.labels.find_by(short_desc: name)
          if label.nil?
            puts "#{name} label not found for #{community.name}"
            next
          end

          user_with_label_ids = label.user_labels.pluck(:user_id)
          target_ids = community_user_ids - user_with_label_ids
          puts "Adding #{label.short_desc} for #{target_ids.count} users ..."
          community.users.where(id: target_ids).find_each do |user|
            user.user_labels.create!(label_id: label.id)
          end
          puts "Successfully added #{label.short_desc} for #{target_ids.count} users."
        end
      end
    end
  rescue StandardError => e
    puts 'Failed to add label for the user'
    puts e.message.to_s
  end
end
