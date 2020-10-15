# frozen_string_literal: true

FactoryBot.define do
  factory :user_form_property do
    value { rand.to_s }
    form_property
    form_user
    user
  end
end
