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
  end
end
