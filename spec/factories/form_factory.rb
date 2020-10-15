# frozen_string_literal: true

FactoryBot.define do
  sequence :form_name do |n|
    "Form #{n}"
  end

  factory :form do
    name { generate(:form_name) }
    expires_at { 1.hour.from_now }
    community
  end
end
