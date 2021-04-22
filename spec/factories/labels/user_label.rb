# frozen_string_literal: true

FactoryBot.define do
  factory :user_label, class: 'Labels::UserLabel' do
    label
    user
  end
end
