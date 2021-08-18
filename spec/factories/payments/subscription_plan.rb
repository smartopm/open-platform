# frozen_string_literal: true

FactoryBot.define do
  factory :subscription_plan, class: 'Payments::SubscriptionPlan' do
    plan_type { 'basic' }
    amount { 20_000 }
    start_date { Time.zone.now }
    end_date { 6.months.from_now }
    community
  end
end
