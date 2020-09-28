# frozen_string_literal: true

require 'email_msg'

task test_message: :environment do
  puts 'merge unsubscribe list'
  users = EmailMsg.fetch_unsubscribes_list
  emails = users.pluck('email')
  community = Community.find_by(name: 'Femoza')
  unsubscribed_users = community.users.where(email: emails)
  label_id = community.labels.find_by(short_desc: 'com_news_email')&.id
  unsubscribed_users.map do |user|
    label = user.user_labels.find_by(label_id: label_id)
    if label.present?
      label.delete
    end
  end
end
