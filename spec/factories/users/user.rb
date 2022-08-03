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
    role { create(:role, name: 'visitor') }

    factory :user_with_community do
      community
      role { create(:role, name: 'visitor') }
    end

    factory :contractor do
      user_type { 'contractor' }
      role { create(:role, name: 'contractor') }
      community
    end

    factory :security_guard do
      user_type { 'security_guard' }
      role { create(:role, name: 'security_guard') }
      community
    end

    factory :admin_user do
      user_type { 'admin' }
      role { create(:role, name: 'admin') }
      community
    end

    factory :pending_user do
      request_status { 'pending' }
      community
    end

    factory :store_custodian do
      user_type { 'custodian' }
      role { create(:role, name: 'custodian') }
      community
    end

    factory :site_worker do
      user_type { 'site_worker' }
      role { create(:role, name: 'site_worker') }
      community
    end

    factory :resident do
      user_type { 'resident' }
      role { create(:role, name: 'resident') }
      community
    end

    factory :client do
      user_type { 'client' }
      role { create(:role, name: 'client') }
      community
    end

    factory :developer do
      community
      user_type { 'developer' }
      role { create(:role, name: 'developer') }
    end

    factory :consultant do
      community
      user_type { 'consultant' }
      role { create(:role, name: 'consultant') }
    end

    factory :lead do
      community
      user_type { 'lead' }
      role { create(:role, name: 'lead') }
    end

    factory :marketing_admin do
      community
      user_type { 'marketing_admin' }
      role { create(:role, name: 'marketing_admin') }
    end
  end
end
