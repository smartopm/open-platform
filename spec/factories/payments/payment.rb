# frozen_string_literal: true

FactoryBot.define do
  factory :payment, class: 'Payments::Payment' do
    user
    payment_type { 'cash' }
  end
end
