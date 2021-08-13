# frozen_string_literal: true

module Forms
  # Class Category
  class Category < ApplicationRecord
    belongs_to :form
    belongs_to :question, class_name: 'FormProperty', optional: true,
                          foreign_key: :form_property_id, inverse_of: :sub_categories
    has_many :form_properties, dependent: :destroy
  end
end
