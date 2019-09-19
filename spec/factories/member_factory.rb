# frozen_string_literal: true

FactoryBot.define do
  factory :member do
    user
    factory :member_with_community do
      community
    end
  end
end
