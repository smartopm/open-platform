# frozen_string_literal: true

FactoryBot.define do

  factory :activity_log, class: 'Logs::ActivityLog' do
    community
  end
end
