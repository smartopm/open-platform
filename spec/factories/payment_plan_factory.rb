# frozen_string_literal: true

FactoryBot.define do
  factory :payment_plan do
    plan_type { 'lease' }
    start_date { Time.zone.now }
    percentage { '50%' }
    status { 'active' }
    land_parcel
    user
  end
end
