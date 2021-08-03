# frozen_string_literal: true

FactoryBot.define do
  sequence :community_name do |n|
    "Community ##{n}"
  end

  factory :community do
    name { generate(:community_name) }
    currency { 'zambian_kwacha' }
    theme_colors do
      {
        primaryColor: '#cf5628', secondaryColor: '#cf5628'
      }
    end
  end
end
