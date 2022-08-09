# frozen_string_literal: true

namespace :db do
  desc 'Add url to notifications'
  task add_url_to_notifications: :environment do
    errors = {}
    Community.find_each do |community|
      community.notifications.find_each do |notification|
        notifable = notification.notifable
        next if notifable.nil?

        case notification.category
        when 'message'
          unless notification.update(url: notifable.message_url)
            errors[notification.id] = notifable.errors.full_messages&.join(', ')
          end
        when 'task'
          unless notification.update(url: notifable.note_link)
            errors[notification.id] = notifable.errors.full_messages&.join(', ')
          end
        when 'comment', 'reply_requested'
          unless notification.update(url: notifable.comment_url)
            errors[notification.id] = notifable.errors.full_messages&.join(', ')
          end
        end
      end
    end

    if errors.empty?
      puts 'Added url successfully'
    else
      p errors
    end
  end
end
