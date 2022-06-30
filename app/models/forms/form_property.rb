# frozen_string_literal: true

module Forms
  # Form Fields
  class FormProperty < ApplicationRecord
    # TODO: Remove the association, won't be required because we have category now.
    belongs_to :form
    belongs_to :category
    has_many :user_form_properties, dependent: :destroy

    default_scope { order(order: :asc) }

    enum field_type: { text: 0, date: 1, file_upload: 2, signature: 3, display_text: 4,
                       display_image: 5, radio: 6, checkbox: 7, dropdown: 8, time: 9,
                       datetime: 10, payment: 11 }
  end
end
