# frozen_string_literal: true

FactoryBot.define do
  sequence :community_name do |n|
    "Community ##{n}"
  end

  factory :community do
    name { generate(:community_name) }
    currency { 'zambian_kwacha' }
    features do
      ['Dashboard', 'Search', 'Profile', 'Messages', 'Communication', 'LogBook', 'Payments',
       'Invoices', 'Transactions', 'Forms', 'Customer Journey', 'UserStats', 'Users', 'Properties',
       'News', 'Discussions', 'Campaigns', 'Labels', 'Tasks', 'Business', 'Forms',
       'Email Templates', 'Community', 'Contact', 'Referral', 'My Thebe Portal', 'Action Flows',
       'Time Card', 'Logout', 'Showroom']
    end
  end
end
