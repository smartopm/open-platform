# frozen_string_literal: true

FactoryBot.define do
  factory :valuation, class: 'Properties::Valuation' do
    amount { rand * 1000 }
    start_date { Time.zone.now }
    land_parcel
  end
end
