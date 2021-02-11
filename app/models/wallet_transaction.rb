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
  validates :transaction_number, length: { maximum: 35, allow_blank: true }

  enum status: { settled: 0, pending: 1, denied: 2, cancelled: 3 }

  # rubocop:disable Style/ParenthesesAroundCondition
  def update_wallet_balance
    return if (!status.eql?('settled') || PaymentInvoice.exists?(wallet_transaction_id: id))

    self.current_wallet_balance = user.wallet.update_balance(amount)
  end
  # rubocop:enable Style/ParenthesesAroundCondition
end
