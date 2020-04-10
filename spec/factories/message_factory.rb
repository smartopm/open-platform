# frozen_string_literal: true

FactoryBot.define do
  sequence :t_message do |n|
    "Hello test me #{n}"
  end

  factory :message do
    receiver { 'Mark Test' }
    message { generate(:t_message) }
    is_read { false }
  end
end
