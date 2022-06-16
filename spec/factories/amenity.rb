# frozen_string_literal: true

FactoryBot.define do
  sequence :amenity_name do |n|
    "Amenity-##{n}"
  end

  factory :amenity do
    name { generate(:amenity_name) }
    location { 'some_place' }
    hours { '12:00' }
    description { 'A party next door' }
  end
end
