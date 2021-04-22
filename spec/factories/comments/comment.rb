# frozen_string_literal: true

FactoryBot.define do
  factory :comment, class: 'Comments::Comment' do
    user
    community
  end
end
