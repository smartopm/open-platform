# frozen_string_literal: true

# Manages deposits record of user.
class Transaction < ApplicationRecord
  VALID_SOURCES = %w[cash cheque/cashier_cheque wallet mobile_money invoice
                     bank_transfer/eft bank_transfer/cash_deposit pos
                     unallocated_funds].freeze

  enum status: { accepted: 0, pending: 1, denied: 2, cancelled: 3 }

  belongs_to :community
  belongs_to :user
  belongs_to :depositor, class_name: 'User', optional: true
  has_many :plan_payments, inverse_of: :user_transaction, dependent: :destroy

  validates :source, inclusion: { in: VALID_SOURCES, allow_nil: false }
  validates :bank_name, :cheque_number, presence: true,
                                        if: -> { source.eql?('cheque/cashier_cheque') }
  validates :transaction_number, uniqueness: true, length: { maximum: 35, allow_blank: true },
                                 if: -> { transaction_number.present? }
  validates :amount, numericality: { greater_than: 0 }

  has_paper_trail
end
