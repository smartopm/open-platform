# frozen_string_literal: true

FactoryBot.define do
  factory :land_parcel_account, class: 'Properties::LandParcelAccount' do
    land_parcel
    account
  end
end
