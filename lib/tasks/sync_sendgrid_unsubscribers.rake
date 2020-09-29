# frozen_string_literal: true

require 'email_msg'

# task sync_sendgrid_unsubscribers: :environment do
task :sync_sendgrid_unsubscribers, [:community_name] => :environment do |_t, args|
  puts 'merging unsubscribed users from sendgrid'
  start_time = Time.zone.now.beginning_of_year.to_i
  users = EmailMsg.fetch_unsubscribes_list(start_time)
  community = Community.find_by(name: args.community_name)
  unsubscribed_users = community.users.where(email: users.pluck('email'))
  label_id = community.labels.find_by(short_desc: 'com_news_email')&.id
  UserLabel.where(label_id: label_id, user_id: unsubscribed_users.pluck(:id)).delete_all
end
