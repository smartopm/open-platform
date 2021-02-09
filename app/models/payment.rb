# frozen_string_literal: true

# Payment Record
class Payment < ApplicationRecord
  include SearchCop

  belongs_to :user
  has_many :payment_invoices, dependent: :destroy
  has_many :invoices, through: :payment_invoices

  search_scope :search do
    attributes :cheque_number, :amount, :bank_name, :payment_type, :created_at
    attributes user: ['user.name', 'user.email', 'user.phone_number']
  end

  enum payment_status: { settled: 0, pending: 1, denied: 2, cancelled: 3 }
  VALID_TYPES = ['cash', 'cheque/cashier_cheque', 'wallet'].freeze

  validates :payment_type, inclusion: { in: VALID_TYPES, allow_nil: false }
  default_scope { order(created_at: :desc) }
end
