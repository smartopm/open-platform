# frozen_string_literal: true

FactoryBot.define do
  factory :lead_log, class: 'Logs::LeadLog' do
    user
    community
    log_type { 'event' }
    name { 'Demo Event' }
  end
end
