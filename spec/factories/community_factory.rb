# frozen_string_literal: true

FactoryBot.define do
  sequence :community_name do |n|
    "Community ##{n}"
  end

  factory :community do
    name { generate(:community_name) }
  end
end
