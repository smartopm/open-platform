# frozen_string_literal: true

FactoryBot.define do
  factory :payment_plan, class: 'Properties::PaymentPlan' do
    plan_type { 'lease' }
    start_date { Time.zone.now }
    percentage { '50%' }
    status { 'active' }
    land_parcel
    plot_balance { 0 }
    total_amount { 0 }
    user
    installment_amount { 1 }
    duration { 12 }
    frequency { 'monthly' }
  end
end
