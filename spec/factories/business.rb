# frozen_string_literal: true

FactoryBot.define do
  sequence :business_name do |n|
    "artist #{n}"
  end

  factory :business do
    name { generate(:business_name) }
  end
end
