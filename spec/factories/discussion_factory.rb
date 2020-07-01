FactoryBot.define do
  sequence :discussion_title do |n|
    "Community Discussion  ##{n}"
  end

  factory :discussion do
    community
    title { generate(:discussion_title) }
  end
end
