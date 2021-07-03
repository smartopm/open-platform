# frozen_string_literal: true

FactoryBot.define do
  factory :wallet_transaction, class: 'Payments::WalletTransaction' do
    user
    source { 'cash' }
    status { 'settled' }
    amount { (rand * 1000).ceil }
  end
end
