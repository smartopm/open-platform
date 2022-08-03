# frozen_string_literal: true

desc 'update community with specific features'
task update_community_features: :environment do
  puts 'updating community ....'
  all_features = [
    'Dashboard', 'Search', 'Profile', 'Messages', 'Communication',
    'LogBook', 'Payments', 'Invoices', 'Transactions', 'Forms',
    'Customer Journey', 'UserStats', 'Users', 'Properties', 'News',
    'Discussions', 'Campaigns', 'Labels', 'Tasks', 'Business', 'Forms',
    'Email Templates', 'Community', 'Contact', 'Referral', 'My Thebe Portal',
    'Action Flows', 'Time Card', 'Logout', 'Showroom', 'DynamicMenu', 'Guest List'
  ]

  mc_features = [
    'Dashboard', 'Search', 'Profile', 'Messages', 'Communication',
    'LogBook', 'Forms', 'Users', 'News', 'Discussions',
    'Campaigns', 'Tasks', 'Business', 'Forms',
    'Email Templates', 'Community', 'Contact',
    'Referral', 'Logout', 'Labels', 'DynamicMenu', 'Reports', 'Guest List'
  ]

  ActiveRecord::Base.transaction do
    Community.all.each do |comm|
      features = {}
      if comm.name == 'Ciudad Morazán'
        mc_features.each do |key|
          features[key] = { features: [] }
        end
      else
        all_features.each do |key|
          features[key] = { features: [] }
        end
      end

      comm.update!(features: features)
    end
    puts 'Done'
  end
end
