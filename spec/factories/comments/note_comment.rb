# frozen_string_literal: true

FactoryBot.define do
  sequence :comment_body do |n|
    "Comment #{n}"
  end

  factory :note_comment, class: 'Comments::NoteComment' do
    body { generate(:comment_body) }
    note
    user
  end
end
