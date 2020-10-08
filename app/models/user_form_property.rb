# frozen_string_literal: true

# Form User Form Properties Record
class UserFormProperty < ApplicationRecord
  belongs_to :form_property
  belongs_to :form_user
  belongs_to :user

  validates :value, presence: true
end
