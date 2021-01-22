# frozen_string_literal: true

# Payment Record
class Payment < ApplicationRecord
  has_many :invoices, through: :payment_invoices

  VALID_TYPES = ['cash', 'cheque/cashier_cheque'].freeze

  validates :payment_type, inclusion: { in: VALID_TYPES, allow_nil: false }
end
