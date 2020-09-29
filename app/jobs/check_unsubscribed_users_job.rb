# frozen_string_literal: true

require 'email_msg'

# Check users who have unsubscribed from our emails
class CheckUnsubscribedUsersJob < ApplicationJob
  queue_as :default

  def perform(community)
    # get list of users who unsubscribed
    start_time = Time.zone.now.beginning_of_day
    end_time = Time.zone.now
    users = EmailMsg.fetch_unsubscribes_list(start_time, end_time)
    emails = users.pluck('email')
    community = Community.find_by(name: community)
    unsubscribed_users = community.users.where(email: emails)
    label_id = community.labels.find_by(short_desc: 'com_news_email')&.id
    unsubscribed_users.map do |user|
      label = user.user_labels.find_by(label_id: label_id)
      label.delete if label.present?
    end
  end
end
