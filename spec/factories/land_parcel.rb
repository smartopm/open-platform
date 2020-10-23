# frozen_string_literal: true

FactoryBot.define do
  sequence :parcel do |n|
    "artist #{n}"
  end

  factory :land_parcel do
    parcel_number { generate(:parcel) }
  end
end
