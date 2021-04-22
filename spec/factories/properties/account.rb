# frozen_string_literal: true

FactoryBot.define do
  factory :account, class: 'Properties::Account' do
    user
    community
  end
end
