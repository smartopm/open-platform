# frozen_string_literal: true

require 'email_msg'

# Check users who have unsubscribed from our emails
class CheckUnsubscribedUsersJob < ApplicationJob
  queue_as :default

  def perform(community)
    # get list of users who unsubscribed
    start_time = Time.zone.now.beginning_of_day
    users = EmailMsg.fetch_unsubscribes_list(start_time)
    community = Community.find_by(name: community)
    unsubscribed_users = community.users.where(email: users.pluck('email'))
    label_id = community.labels.find_by(short_desc: 'com_news_email')&.id
    UserLabel.where(label_id: label_id, user_id: unsubscribed_users.pluck(:id)).delete_all
  end
end
