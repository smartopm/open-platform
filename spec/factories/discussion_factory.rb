# frozen_string_literal: true

FactoryBot.define do
  sequence :discussion_title do |n|
    "Community Discussion  ##{n}"
  end

  factory :discussion do
    community
    title { generate(:discussion_title) }
    post_id { '20' }
  end
end
