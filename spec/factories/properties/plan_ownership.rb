# frozen_string_literal: true

FactoryBot.define do
  factory :plan_ownership, class: 'Properties::PlanOwnership' do
    user
    payment_plan
  end
end
