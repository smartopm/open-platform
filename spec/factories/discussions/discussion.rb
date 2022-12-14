# frozen_string_literal: true

FactoryBot.define do
  sequence :discussion_title do |n|
    "Community Discussion  ##{n}"
  end

  factory :discussion, class: 'Discussions::Discussion' do
    community
    title { generate(:discussion_title) }
  end
end
