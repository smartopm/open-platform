# frozen_string_literal: true

FactoryBot.define do
  factory :payment do
    user
    payment_type { 'cash' }
  end
end
