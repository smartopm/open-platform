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

  def collect_payment
    paid! if amount < user.wallet.balance
    user.wallet.update_balance(amount, 'debit')
  end
end
