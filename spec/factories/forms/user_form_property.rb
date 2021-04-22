# frozen_string_literal: true

FactoryBot.define do
  factory :user_form_property, class: 'Forms::UserFormProperty' do
    value { rand.to_s }
    form_property
    form_user
    user
  end
end
