# frozen_string_literal: true

FactoryBot.define do
  factory :payment_plan, class: 'Properties::PaymentPlan' do
    plan_type { 'lease' }
    start_date { Time.zone.now }
    percentage { '50%' }
    status { 'active' }
    land_parcel
    plot_balance { (rand * 10_000).floor }
    total_amount { 0 }
    user
    monthly_amount { 0 }
    duration_in_month { 12 }
  end
end