# frozen_string_literal: true

FactoryBot.define do
  factory :discussion_user do
    user
    discussion
  end
end
