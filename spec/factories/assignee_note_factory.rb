# frozen_string_literal: true

FactoryBot.define do
  factory :assignee_note do
    note
    user
  end
end
