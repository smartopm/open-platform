# frozen_string_literal: true

require 'email_msg'

# Check users who have unsubscribed from our emails
class CheckUnsubscribe < ApplicationJob
  queue_as :default

  def perform(community)
    # get list of users who unsubscribed
    users = EmailMsg.fetch_unsubscribes_list
    emails = users.pluck('email')
    community = Community.find_by(name: community)
    unsubscribed_users = community.users.where(email: emails)
    label_id = community.labels.find_by(short_desc: 'com_news_email')&.id
    unsubscribed_users.map do |user|
      label = user.user_labels.find_by(label_id: label_id)
      if label.present?
        label.delete
      end
    end
  end
end
