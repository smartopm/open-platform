# frozen_string_literal: true

# Payment Record
class Payment < ApplicationRecord
  belongs_to :user
  belongs_to :invoice

  VALID_TYPES = ['cash', 'cheque/cashier_cheque'].freeze

  validates :payment_type, inclusion: { in: VALID_TYPES, allow_nil: false }
  validates :bank_name, :cheque_number, presence: true,
                                        if: -> { payment_type.eql?('cheque/cashier_cheque') }

  enum payment_status: { settled: 0, pending: 1, denied: 2, cancelled: 3 }
end
