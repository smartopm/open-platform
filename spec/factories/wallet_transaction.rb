# frozen_string_literal: true

FactoryBot.define do
  factory :wallet_transaction do
    user
    source { 'cash' }
    status { 'settled' }
    amount { (rand * 1000).floor }
  end
end
