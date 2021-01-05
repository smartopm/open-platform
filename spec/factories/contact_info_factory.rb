# frozen_string_literal: true

FactoryBot.define do
  sequence :info do |n|
    "Info #{n}"
  end

  factory :contact_info do
    info { generate(:info) }
    contact_type { ContactInfo::VALID_CONTACT_TYPES.sample }
    user
  end
end
