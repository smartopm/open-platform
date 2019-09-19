# frozen_string_literal: true

FactoryBot.define do
  sequence :uid do |n|
    "oauth_uid_#{n}"
  end
  sequence :email do |n|
    "email_#{n}@doublegdp.com"
  end

  factory :user do
    name { 'Mark Test' }
    email
    provider { 'google' }
    uid

    factory :user_with_membership do
      after :create do |user|
        community = FactoryBot.create(:community)
        create_list :member, 1, user: user, community: community
      end
    end
  end
end
