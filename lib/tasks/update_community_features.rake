
# frozen_string_literal: true

desc 'update community with specific features'
task update_community_features: :environment do
  puts 'updating community ....'
  all_features = ['Dashboard', 'Search', 'Profile', 'Messages', 'Communication', 'LogBook', "Payments", 'Invoices', 'Transactions', 'User Payment', 'Forms', 'Customer Journey', 'UserStats', 'Users', 'Properties', 'News', 'Message', 'Discussions', 'Campaigns', 'Labels', 'Tasks', 'Business', 'Forms', 'Email Templates', 'Community', 'Contact', 'Referral', 'My Thebe Portal', 'Action Flows', 'Time Card', 'Logout']
  mc_features = ['Dashboard', 'Search', 'Profile', 'Messages', 'Communication', 'LogBook', 'Forms', 'Customer Journey', 'Users', 'News', 'Message', 'Discussions', 'Campaigns', 'Labels', 'Tasks', 'Business', 'Forms', 'Email Templates', 'Community', 'Contact', 'Referral', 'Logout']
  
  Community.all.each do |comm|
    if comm.name == 'Ciudad Morazán'
        comm.update!(features: mc_features)
    else
      comm.update!(features: all_features)
    end
  end
end
