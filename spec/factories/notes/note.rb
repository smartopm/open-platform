# frozen_string_literal: true

FactoryBot.define do
  sequence :note_title do |n|
    "note #{n}"
  end

  factory :note, class: 'Notes::Note' do
    body { generate(:note_title) }
    community
  end
end
