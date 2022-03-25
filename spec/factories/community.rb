# frozen_string_literal: true

FactoryBot.define do
  sequence :community_name do |n|
    "Community ##{n}"
  end

  factory :community do
    name { generate(:community_name) }
    currency { 'zambian_kwacha' }
    sms_phone_numbers { %w[254723456783 254724861281] }
    theme_colors do
      {
        primaryColor: '#cf5628', secondaryColor: '#cf5628'
      }
    end
    timezone { 'Africa/Lusaka' }
    hotjar { 239_042 }
  end
end
