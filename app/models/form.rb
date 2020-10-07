# frozen_string_literal: true

# Form Record
class Form < ApplicationRecord
  belongs_to :community

  has_many :form_properties

  validates :name, presence: true, uniqueness: true
  validates :expires_at, presence: true
end
