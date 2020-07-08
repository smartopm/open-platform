# frozen_string_literal: true

FactoryBot.define do
  sequence :label_short_desc do |n|
    "label #{n}"
  end

  factory :label do
    short_desc { generate(:label_short_desc) }
    community
  end
end
