class WalletTransaction < ApplicationRecord
  VALID_SOURCES = ['cash', 'cheque/cashier_cheque'].freeze

  validates :source, inclusion: { in: VALID_SOURCES, allow_nil: false }
  validates :bank_name, :cheque_number, presence: true,
                                        if: -> { source.eql?('cheque/cashier_cheque') }

  enum status: { settled: 0, pending: 1, denied: 2, cancelled: 3 }
end
