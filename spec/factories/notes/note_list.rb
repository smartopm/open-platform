# frozen_string_literal: true

FactoryBot.define do
  sequence :note_list_title do |n|
    "NoteList #{n}"
  end

  factory :note_list, class: 'Notes::NoteList' do
    name { generate(:note_list_title) }
    community
  end
end
