# frozen_string_literal: true

FactoryBot.define do
  sequence :t_message do |n|
    "Hello test me #{n}"
  end

  factory :message do
    receiver { 'Mark Test' }
    category { 'email' }
    sender { user }
    message { generate(:t_message) }
  end
end
