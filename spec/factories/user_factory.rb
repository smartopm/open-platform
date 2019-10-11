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

    factory :user_with_community do
      community
    end
    factory :security_guard do
      user_type { 'security_guard' }
    end
    factory :admin_user do
      user_type { 'admin' }
    end
    factory :pending_user do
      request_status { 'pending' }
    end
  end
end
