# frozen_string_literal: true

# ContactInfo
class ContactInfo < ApplicationRecord
  belongs_to :user

  VALID_CONTACT_TYPES = %w[phone email address].freeze

  validates :contact_type, inclusion: { in: VALID_CONTACT_TYPES, allow_nil: false }
end
