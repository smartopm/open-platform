# frozen_string_literal: true

FactoryBot.define do
  factory :member do
    user
    factory :member_with_community_and_roles do
      community { create :community_with_roles }
      role { community.roles.first }
    end
  end
end
