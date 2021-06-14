# frozen_string_literal: true

FactoryBot.define do
  factory :plan_payment, class: 'Payments::PlanPayment' do
    status { 'paid' }
  end
end
