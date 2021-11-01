# frozen_string_literal: true

FactoryBot.define do
  sequence :uid do |n|
    "oauth_uid_#{n}"
  end
  sequence :email do |n|
    "email_#{n}@doublegdp.com"
  end

  sequence :phone_number do |n|
    "1404555121#{n}"
  end

  factory :user, class: 'Users::User' do
    name { 'Mark Test' }
    phone_number
    email
    provider { 'google' }
    uid

    factory :user_with_community do
      community
    end

    factory :contractor do
      user_type { 'contractor' }
      community
    end

    factory :security_guard do
      user_type { 'security_guard' }
      community
    end
    factory :admin_user do
      user_type { 'admin' }
      community
    end
    factory :pending_user do
      request_status { 'pending' }
      community
    end
    factory :store_custodian do
      user_type { 'custodian' }
      community
    end
    factory :site_worker do
      user_type { 'site_worker' }
      community
    end
    factory :resident do
      user_type { 'resident' }
      community
    end
  end
end
