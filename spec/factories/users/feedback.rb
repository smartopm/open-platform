# frozen_string_literal: true

FactoryBot.define do
  factory :feedback, class: 'Users::Feedback' do
    user
  end
end
