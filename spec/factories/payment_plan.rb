# frozen_string_literal: true

FactoryBot.define do
  factory :payment_plan do
    user
    land_parcel
  end
end
