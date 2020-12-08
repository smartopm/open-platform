# frozen_string_literal: true

FactoryBot.define do
  sequence :tag_name do |n|
    "Post Tag #{n}"
  end

  factory :post_tag do
    name { generate(:tag_name) }
    community
    user
  end
end
