# frozen_string_literal: true

# Record the transactions
class WalletTransaction < ApplicationRecord
  include SearchCop

  belongs_to :user
  belongs_to :community
  has_one :payment_invoice, dependent: :destroy

  search_scope :search do
    attributes user: ['user.name', 'user.email', 'user.phone_number']
  end

  before_update :update_wallet_balance, if: proc { changed_attributes.keys.include?('status') }

  VALID_SOURCES = ['cash', 'cheque/cashier_cheque', 'wallet', 'mobile_money',
                   'bank_transfer/eft', 'bank_transfer/cash_deposit', 'pos'].freeze

  validates :source, inclusion: { in: VALID_SOURCES, allow_nil: false }
  validates :bank_name, :cheque_number, presence: true,
                                        if: -> { source.eql?('cheque/cashier_cheque') }
  validates :transaction_number, format: { with: /\A[A-Za-z0-9]*\z/i,
                                           message: 'Transaction Number should be Alphanumeric' }
  validates :transaction_number, uniqueness: true, length: { maximum: 35, allow_blank: true },
                                 if: -> { transaction_number.present? }

  enum status: { settled: 0, pending: 1, denied: 2, cancelled: 3 }

  # rubocop:disable Style/ParenthesesAroundCondition
  def update_wallet_balance
    return if (!status.eql?('settled') || PaymentInvoice.exists?(wallet_transaction_id: id))

    self.current_wallet_balance = user.wallet.update_balance(amount)
  end
  # rubocop:enable Style/ParenthesesAroundCondition

  def self.payment_stat(com)
    WalletTransaction.connection.select_all(
      "select
        CASE
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at)>= 0
          AND DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at) <= 10 THEN '00-10'
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at)>= 11
          AND DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at) <= 20 THEN '11-20'
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at)>= 21
          AND DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at) <= 30 THEN '21-30'
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at)>= 31
          AND DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at) <= 40 THEN '31-40'
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at)>= 41
          AND DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at) <= 50 THEN '41-50'
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at)>= 51
          AND DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at) <= 60 THEN '51-60'
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at)>= 61
          AND DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at) <= 70 THEN '61-70'
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at)>= 71
          AND DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at) <= 80 THEN '71-80'
          WHEN DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at)>= 81
          AND DATE_PART('day', CURRENT_TIMESTAMP - wall.created_at) <= 90 THEN '81-90'
        END no_of_days, 
        sum(CASE WHEN wall.source='cash' THEN 1 END) as cash,
        sum(CASE WHEN wall.source='mobile_money' THEN 1 END) as mobile_money,
        sum(CASE WHEN wall.source='bank_transfer/cash_deposit' THEN 1 END) as bank_transfer,
        sum(CASE WHEN wall.source='bank_transfer/eft' THEN 1 END) as eft,
        sum(CASE WHEN wall.source='pos' THEN 1 END) as pos from wallet_transactions wall where wall.community_id='#{com}' AND wall.destination = 'wallet' group by no_of_days")
  end
end
