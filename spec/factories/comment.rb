# frozen_string_literal: true

FactoryBot.define do
  factory :comment do
    user
    community
  end
end
