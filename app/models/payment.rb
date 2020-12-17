class Payment < ApplicationRecord
  belongs_to :user
  belongs_to :invoice

  VALID_TYPES = %w[cash]

  validates :payment_type, inclusion: { in: VALID_TYPES, allow_nil: false }

  enum payment_status: { settled: 0, pending: 1, denied: 2, cancelled: 3 }
end
