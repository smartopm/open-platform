# frozen_string_literal: true

# PaymentInvoice
class PaymentInvoice < ApplicationRecord
  belongs_to :payment
  belongs_to :invoice

  scope :transaction_id_equals, ->(txn_id) { where(wallet_transaction_id: txn_id) }
  scope :payment_status_not_equals, ->(status) { joins(:payment).where.not(payments: { payment_status: 'cancelled' }) }

  def self.deposit_payments(transaction_id)
    transaction_id_equals(transaction_id).payment_status_not_equals('cancelled').map(&:payment)
  end
end
