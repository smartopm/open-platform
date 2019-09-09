# frozen_string_literal: true

FactoryBot.define do
  sequence :role_name do |n|
    "Role ##{n}"
  end

  factory :role do
    name { generate(:role_name) }
  end
end
