# frozen_string_literal: true

# Record the transactions
class WalletTransaction < ApplicationRecord
  include SearchCop

  belongs_to :user
  belongs_to :community
  belongs_to :depositor, class_name: 'User', optional: true
  belongs_to :email_template, optional: true
  belongs_to :payment_plan, optional: true
  has_one :payment_invoice, dependent: :destroy

  has_paper_trail

  search_scope :search do
    attributes :source, :created_at, :transaction_number, :cheque_number
    attributes user: ['user.name']
    attributes phone_number: ['user.phone_number']
    attributes email: ['user.email']
  end

  before_update :update_wallet_balance, if: proc { changed_attributes.keys.include?('status') }
  after_update :revert_payments, if: proc { saved_changes.key?('status') }

  VALID_SOURCES = ['cash', 'cheque/cashier_cheque', 'wallet', 'mobile_money', 'invoice',
                   'bank_transfer/eft', 'bank_transfer/cash_deposit', 'pos'].freeze

  validates :source, inclusion: { in: VALID_SOURCES, allow_nil: false }
  validates :bank_name, :cheque_number, presence: true,
                                        if: -> { source.eql?('cheque/cashier_cheque') }
  validates :transaction_number, uniqueness: true, length: { maximum: 35, allow_blank: true },
                                 if: -> { transaction_number.present? }

  enum status: { settled: 0, pending: 1, denied: 2, cancelled: 3 }

  validates :amount, numericality: { greater_than: 0 }

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
     where destination = 'wallet' and source != 'invoice'
     and wallet_transactions.community_id='#{com.id}'
     and wallet_transactions.created_at > (CURRENT_TIMESTAMP - interval '365 days')
     group by trx_date order by trx_date",
    )
  end

  # rubocop:disable Metrics/AbcSize
  def revert_payments
    update_plot_balance(amount)
    user.wallet.update_balance(amount, 'debit')
    payments = PaymentInvoice.deposit_payments(self.id)
    payments.each do |payment|
      ActiveRecord::Base.transaction do
        payment.cancelled!
        revert_invoice_amounts(payment)
      end
    end
  end

  def revert_invoice_amounts(payment)
    revert_amount = amount
    invoices = payment.invoices.not_cancelled
    invoices.each do |inv|
      next unless revert_amount.positive?

      paid_amount = inv.amount - inv.pending_amount
      inv_revert_amount = paid_amount > revert_amount ? revert_amount : paid_amount
      inv.update(status: 'in_progress', pending_amount: inv.pending_amount + inv_revert_amount)
      revert_amount -= inv_revert_amount
      cancel_transaction(inv.payment_plan, payment.amount)
    end
  end

  def update_plot_balance(amount)
    plan = user.payment_plans.find_by(id: payment_plan_id)
    return if plan.nil?

    plan.update_plot_balance(amount, 'debit')
  end

  private

  def cancel_transaction(payment_plan, payment_amount)
    txn_attributes = { source: 'wallet', destination: 'invoice', amount: payment_amount }
    wallet_transactions = payment_plan.wallet_transactions.not_cancelled.order(created_at: :desc)
    wallet_transaction = wallet_transactions.find_by(txn_attributes)&.update_columns(status: 'cancelled')
  end
end
