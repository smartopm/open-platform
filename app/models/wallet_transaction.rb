# frozen_string_literal: true

# Record the transactions
class WalletTransaction < ApplicationRecord
  include SearchCop

  belongs_to :user
  belongs_to :community
  belongs_to :depositor, class_name: 'User', optional: true
  has_one :payment_invoice, dependent: :destroy

  search_scope :search do
    attributes user: ['user.name', 'user.email', 'user.phone_number']
  end

  before_update :update_wallet_balance, if: proc { changed_attributes.keys.include?('status') }

  VALID_SOURCES = ['cash', 'cheque/cashier_cheque', 'wallet', 'mobile_money', 'invoice',
                   'bank_transfer/eft', 'bank_transfer/cash_deposit', 'pos'].freeze

  validates :source, inclusion: { in: VALID_SOURCES, allow_nil: false }
  validates :bank_name, :cheque_number, presence: true,
                                        if: -> { source.eql?('cheque/cashier_cheque') }
  validates :transaction_number, uniqueness: true, length: { maximum: 35, allow_blank: true },
                                 if: -> { transaction_number.present? }

  enum status: { settled: 0, pending: 1, denied: 2, cancelled: 3 }

  # rubocop:disable Style/ParenthesesAroundCondition
  def update_wallet_balance
    return if (!status.eql?('settled') || PaymentInvoice.exists?(wallet_transaction_id: id))

    self.current_wallet_balance = user.wallet.update_balance(amount)
  end
  # rubocop:enable Style/ParenthesesAroundCondition

  # rubocop:disable Metrics/MethodLength
  def self.payment_stat(com)
    WalletTransaction.connection.select_all(
      "select
      date(wallet_transactions.created_at at time zone 'utc' at time zone '#{com.timezone}')
      as trx_date,
      sum(CASE WHEN wallet_transactions.source='cash'
      THEN wallet_transactions.amount ELSE 0 END) as cash,
      sum(CASE WHEN wallet_transactions.source='mobile_money'
      THEN wallet_transactions.amount ELSE 0 END) as mobile_money,
      sum(CASE WHEN wallet_transactions.source='pos'
      THEN wallet_transactions.amount ELSE 0 END) as pos,
      sum(CASE WHEN wallet_transactions.source='bank_transfer/cash_deposit'
      THEN wallet_transactions.amount ELSE 0 END) as bank_transfer,
      sum(CASE WHEN wallet_transactions.source='bank_transfer/eft'
      THEN wallet_transactions.amount ELSE 0 END) as eft
     from wallet_transactions
     where destination = 'wallet' and wallet_transactions.community_id='#{com.id}'
     and wallet_transactions.created_at > (CURRENT_TIMESTAMP - interval '60 days')
     group by trx_date order by trx_date",
    )
  end
  # rubocop:enable Metrics/MethodLength
end
