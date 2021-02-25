# frozen_string_literal: true

FactoryBot.define do
  factory :wallet_transaction do
    user
    source { 'cash' }
  end
end
