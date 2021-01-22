# frozen_string_literal: true

# Payment Record
class Payment < ApplicationRecord
  has_many :payment_invoices, dependent: :destroy
  has_many :invoices, through: :payment_invoices

  enum payment_status: { settled: 0, pending: 1, denied: 2, cancelled: 3 }
  VALID_TYPES = ['cash', 'cheque/cashier_cheque'].freeze

  validates :payment_type, inclusion: { in: VALID_TYPES, allow_nil: false }
end
