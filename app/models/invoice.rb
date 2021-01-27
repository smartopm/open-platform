# frozen_string_literal: true

# Invoice Record
class Invoice < ApplicationRecord
  belongs_to :land_parcel
  belongs_to :community
  belongs_to :user
  belongs_to :created_by, class_name: 'User', optional: true

  after_create :collect_payment

  has_many :payment_invoices, dependent: :destroy
  has_many :payments, through: :payment_invoices

  enum status: { in_progress: 0, paid: 1, late: 2, cancelled: 3 }
  scope :by_status, ->(status) { where(status: status) if status.present? }
  default_scope { order(created_at: :desc) }

  # rubocop:disable Metrics/MethodLength
  def collect_payment
    ActiveRecord::Base.transaction do
      current_payment = settle_amount
      user.wallet.update_balance(amount, 'debit')
      transaction = user.wallet_transactions.create!({
                                                       source: 'wallet',
                                                       destination: 'invoice',
                                                       amount: current_payment,
                                                       status: 'settled',
                                                       user_id: user.id,
                                                     })
      payment = Payment.create(amount: current_payment, payment_type: 'wallet')
      payment_invoices.create(payment_id: payment.id, wallet_transaction_id: transaction.id)
    end
  end
  # rubocop:enable Metrics/MethodLength

  def settle_amount
    pending_amount = amount - user.wallet.balance
    if pending_amount.positive?
      update(pending_amount: pending_amount)
      return amount - pending_amount
    end

    paid!
    amount
  end
end
