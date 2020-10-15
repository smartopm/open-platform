# frozen_string_literal: true

FactoryBot.define do
  sequence :field_name do |n|
    "Field #{n}"
  end

  factory :form_property do
    field_name { generate(:field_name) }
    field_type { %w[text date image signature display_text display_image].sample }
    order { 'order' }
    form
  end
end
