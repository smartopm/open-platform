# frozen_string_literal: true

# Form User Record
class FormUser < ApplicationRecord
  belongs_to :form
  belongs_to :user
  has_many :user_form_properties, dependent: :destroy

  enum status: { draft: 0, pending: 1, approved: 2, rejected: 3 }
end
