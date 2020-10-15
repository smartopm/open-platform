# frozen_string_literal: true

# Form Fields
class FormProperty < ApplicationRecord
  belongs_to :form
  has_many :user_form_properties, dependent: :destroy

  default_scope { order(order: :asc) }

  enum field_type: { text: 0, date: 1, image: 2, signature: 3, display_text: 4, display_image: 5 }
end
