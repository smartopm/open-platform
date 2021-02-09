# frozen_string_literal: true

# Invoice Record
class Invoice < ApplicationRecord
  include SearchCop

  belongs_to :land_parcel
  belongs_to :community
  belongs_to :user
  belongs_to :created_by, class_name: 'User', optional: true

  before_update :modify_status, if: proc { changed_attributes.keys.include?('pending_amount') }
  after_create :collect_payment_from_wallet

  has_many :payment_invoices, dependent: :destroy
  has_many :payments, through: :payment_invoices

  enum status: { in_progress: 0, paid: 1, late: 2, cancelled: 3 }
  scope :by_status, ->(status) { where(status: status) if status.present? }
  default_scope { order(created_at: :desc) }

  search_scope :search do
    attributes :status
    attributes :invoice_number
    attributes land_parcel: ['land_parcel.parcel_number']
    attributes created_by: ['created_by.name', 'created_by.email', 'created_by.phone_number']
    attributes user: ['user.name', 'user.email', 'user.phone_number']
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/AbcSize
  def collect_payment_from_wallet
    ActiveRecord::Base.transaction do
      current_payment = settle_amount
      user.wallet.update_balance(amount, 'debit')
      return if current_payment.zero?

      transaction = user.wallet_transactions.create!({
                                                       source: 'wallet',
                                                       destination: 'invoice',
                                                       amount: current_payment,
                                                       status: 'settled',
                                                       user_id: user.id,
                                                       current_wallet_balance: user.wallet.balance,
                                                       community_id: user.community_id,
                                                     })
      payment = create_payment(current_payment, user)
      payment_invoices.create(payment_id: payment.id, wallet_transaction_id: transaction.id)
    end
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/AbcSize

  def create_payment(payment_amount, user)
    Payment.create(
      amount: payment_amount,
      payment_type: 'wallet',
      user_id: user.id,
      community_id: user.community_id,
    )
  end

  def settle_amount
    pending_amount = amount - user.wallet.balance
    if pending_amount.positive?
      update(pending_amount: pending_amount)
      return amount - pending_amount
    end

    paid!
    amount
  end

  def modify_status
    return if pending_amount.positive? || status.eql?('paid')

    paid!
  end
end
