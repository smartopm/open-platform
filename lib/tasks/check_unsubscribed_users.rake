	
# frozen_string_literal: true

require 'email_msg'

task test_message: :environment do
  puts 'merge unsubscribe list'
  start_time = Time.zone.now.beginning_of_year.to_i
  end_time = Time.zone.now.to_i
  users = EmailMsg.fetch_unsubscribes_list(start_time, end_time)
  community = Community.find_by(name: 'Femoza')
  unsubscribed_users = community.users.where(email: emails = users.pluck('email'))
  label_id = community.labels.find_by(short_desc: 'com_news_email')&.id
  UserLabel.where(label_id: label_id, user_id: unsubscribed_users.pluck(:id)).delete_all
end