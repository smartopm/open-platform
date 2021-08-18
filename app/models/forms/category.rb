# frozen_string_literal: true

module Forms
  # Class Category
  class Category < ApplicationRecord
    belongs_to :form
    has_many :form_properties, dependent: :destroy

    validates :field_name, presence: true, uniqueness: { scope: :form_id }
  end
end
