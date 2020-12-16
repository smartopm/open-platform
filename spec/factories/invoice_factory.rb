# frozen_string_literal: true

FactoryBot.define do
  factory :invoice do
    amount { (rand * 1000).floor }
    due_date { 10.days.from_now }
    status { %w[in_progress paid late cancelled].sample }
    community
    land_parcel
  end
end
