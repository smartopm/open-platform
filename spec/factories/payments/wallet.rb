# frozen_string_literal: true

FactoryBot.define do
  factory :wallet, class: 'Payments::Wallet' do
    currency { Payments::Wallet::DEFAULT_CURRENCY }
    balance { (rand * 100).floor }
    pending_balance { 0 }
    user
  end
end
