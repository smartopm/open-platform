# frozen_string_literal: true

FactoryBot.define do
  sequence :note_title do |n|
    "note #{n}"
  end

  factory :note do
    body { generate(:note_title) }
    community
  end
end
