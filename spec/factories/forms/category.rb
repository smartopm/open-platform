# frozen_string_literal: true

FactoryBot.define do
  sequence :category_field_name do |n|
    "Category #{n}"
  end

  factory :category, class: 'Forms::Category' do
    field_name { generate(:category_field_name) }
    general { false }
    header_visible { true }
    order { 1 }
    form
  end
end
