# frozen_string_literal: true

# Record the transactions
class WalletTransaction < ApplicationRecord
  belongs_to :user
  has_one :payment_invoice, dependent: :destroy

  before_update :update_wallet_balance, if: proc { changed_attributes.keys.include?('status') }

  VALID_SOURCES = ['cash', 'cheque/cashier_cheque', 'wallet'].freeze

  validates :source, inclusion: { in: VALID_SOURCES, allow_nil: false }
  validates :bank_name, :cheque_number, presence: true,
                                        if: -> { source.eql?('cheque/cashier_cheque') }

  enum status: { settled: 0, pending: 1, denied: 2, cancelled: 3 }

  def update_wallet_balance
    return if !status.eql? 'settled' || PaymentInvoice.exists?(wallet_transaction_id: id)

    self.current_wallet_balance = user.wallet.update_balance(amount)
  end
end
