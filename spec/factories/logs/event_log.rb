# frozen_string_literal: true

FactoryBot.define do
  factory :event_log, class: 'Logs::EventLog' do
    association :acting_user, factory: :user_with_community
    data { {} }
  end
end
