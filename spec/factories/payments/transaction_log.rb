# frozen_string_literal: true

FactoryBot.define do
  factory :transaction_log, class: 'Payments::TransactionLog' do
    currency { 'ZMW' }
    amount { 10.0 }
    invoice_number { '1111' }
    description { 'transaction log' }
    integration_type { 'flutterwave' }
    status { 'pending' }
    community
    user
  end
end
