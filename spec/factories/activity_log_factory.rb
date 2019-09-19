# frozen_string_literal: true

FactoryBot.define do
  factory :activity_log do
    member
    community
    reporting_member { member }
    note { 'Fake note for activity' }
  end
end
