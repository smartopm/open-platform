# frozen_string_literal: true

FactoryBot.define do
  sequence :community_name do |n|
    "Community ##{n}"
  end

  factory :community do
    name { generate(:community_name) }
    factory :community_with_roles do
      after :create do |c|
        create_list :role, 3, community: c
      end
    end
  end
end
