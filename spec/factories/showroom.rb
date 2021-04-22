# frozen_string_literal: true

FactoryBot.define do
  sequence :name do |n|
    "Showroom #{n}"
  end

  factory :showroom do
    name { generate(:name) }
  end
end
