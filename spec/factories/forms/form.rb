# frozen_string_literal: true

FactoryBot.define do
  sequence :form_name do |n|
    "Form #{n}"
  end

  factory :form, class: 'Forms::Form' do
    name { generate(:form_name) }
    expires_at { 10.days.from_now }
    status { 1 }
    community
    preview { false }
    multiple_submissions_allowed { true }
  end
end
