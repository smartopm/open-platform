# frozen_string_literal: true

FactoryBot.define do
  factory :notification, class: 'Notifications::Notification' do
    user
    community
    description { 'This is a description' }
  end
end
