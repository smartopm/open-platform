# frozen_string_literal: true

FactoryBot.define do
  factory :invoice, class: 'Payments::Invoice' do
    amount { (rand * 1000).ceil }
    due_date { 10.days.from_now }
    status { Payments::Invoice.statuses.keys.sample }
    community
    land_parcel
    invoice_number { (rand * 10).floor }
  end
end
