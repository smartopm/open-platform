# frozen_string_literal: true

# Form Record
class Form < ApplicationRecord
  belongs_to :community

  has_many :form_properties, dependent: :destroy
  has_many :form_users, dependent: :destroy

  validates :name, presence: true, uniqueness: true
  validates :expires_at, presence: true
end
