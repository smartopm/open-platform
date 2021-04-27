# frozen_string_literal: true

module Payments
  # Record the transactions
  # rubocop:disable Metrics/ClassLength
  class WalletTransaction < ApplicationRecord
    include SearchCop

    VALID_SOURCES = %w[cash cheque/cashier_cheque wallet mobile_money invoice
                      bank_transfer/eft bank_transfer/cash_deposit pos
                      unallocated_funds].freeze

    enum status: { settled: 0, pending: 1, denied: 2, cancelled: 3 }

    belongs_to :user, class_name: 'Users::User'
    belongs_to :community
    belongs_to :depositor, class_name: 'Users::User', optional: true
    belongs_to :email_template, optional: true
    belongs_to :payment_plan, class_name: 'Properties::PaymentPlan', optional: true
    has_one :payment_invoice, dependent: :destroy

    validates :source, inclusion: { in: VALID_SOURCES, allow_nil: false }
    validates :bank_name, :cheque_number, presence: true,
                                          if: -> { source.eql?('cheque/cashier_cheque') }
    validates :transaction_number, uniqueness: true, length: { maximum: 35, allow_blank: true },
                                  if: -> { transaction_number.present? }

    validates :amount, numericality: { greater_than: 0 }

    before_update :update_wallet_balance, if: proc { changed_attributes.keys.include?('status') }
    after_update :revert_payments, if: proc { saved_changes.key?('status') }

    has_paper_trail

    search_scope :search do
      attributes :source, :created_at, :transaction_number, :cheque_number
      attributes user: ['user.name']
      attributes phone_number: ['user.phone_number']
      attributes email: ['user.email']
    end

    # rubocop:disable Style/ParenthesesAroundCondition
    def update_wallet_balance
      return if (!status.eql?('settled') || PaymentInvoice.exists?(wallet_transaction_id: id))

      self.current_wallet_balance = user.wallet.update_balance(amount)
    end
    # rubocop:enable Style/ParenthesesAroundCondition

    # rubocop:disable Metrics/MethodLength
    def self.payment_stat(com)
      WalletTransaction.connection.select_all(
        sanitize_sql(
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
        where destination = 'wallet' and status != 3
        and wallet_transactions.community_id='#{com.id}'
        and wallet_transactions.created_at > (CURRENT_TIMESTAMP - interval '365 days')
        group by trx_date order by trx_date",
        ),
      )
    end

    private

    # rubocop:disable Metrics/AbcSize
    # Reverts payments from wallet balance.
    # * Updates wallet balance
    # * Cancels payments
    # * Updates invoice pending amount
    # * Updates plot pending balance with invoice revert amount.
    #
    # @return [void]
    def revert_payments
      wallet = user.wallet
      amount_to_revert = wallet.balance.positive? ? amount - wallet.balance : amount
      user_payments.each do |payment|
        break unless amount_to_revert.positive?

        cur_revert_amount = payment.amount < amount_to_revert ? payment.amount : amount_to_revert
        cancel_payment(payment, cur_revert_amount)
        amount_to_revert -= cur_revert_amount
      end
      debit_wallet_balance(wallet, amount)
    end

    # Returns payments of user which are not cancelled.
    #
    # @return [Array<Payment>]
    def user_payments
      user.payments.not_cancelled.order(created_at: :desc)
    end

    # Deducts amount from wallet balance.
    #
    # @param wallet [Wallet]
    # @param amount [Float]
    #
    # @return [void]
    def debit_wallet_balance(wallet, amount)
      wallet.update_balance(amount, 'debit')
      wallet.debit_unallocated_funds(amount)
    end

    # Cancels payment and revert paid amount of associated invoices.
    #
    # @param payment [Payment]
    # @param payment_amount [Float]
    #
    # @return [void]
    def cancel_payment(payment, revert_amount)
      ActiveRecord::Base.transaction do
        payment.cancelled!
        create_new_payment(payment, revert_amount)
        revert_payment_invoices(payment, revert_amount)
      end
    end
    # rubocop:enable Metrics/MethodLength
    # rubocop:enable Metrics/AbcSize

    # Creates new payment log(WalletTransaction/Payment) for payment invoice.
    #
    # @param payment [Payment]
    # @param payment_amount [Float]
    #
    # @return [void]
    def create_new_payment(payment, payment_amount)
      return if payment.amount.eql? payment_amount

      inv = payment.invoices.first
      transaction = user.wallet.create_transaction(payment_amount, inv)
      payment = Payment.create(amount: payment_amount, payment_type: 'wallet',
                              payment_status: 'settled', user_id: user.id,
                              community_id: user.community_id)
      payment.payment_invoices.create(invoice_id: inv.id, wallet_transaction_id: transaction.id)
    end

    # Reverts payment amount from paid invoices
    #
    # @param payment [Payment]
    # @param payment_amount [Float]
    #
    # @return [void]
    def revert_payment_invoices(payment, revert_amount)
      payment.invoices.not_cancelled.each do |inv|
        break unless revert_amount.positive?

        paid_amount = inv.amount - inv.pending_amount
        inv_revert_amount = paid_amount > revert_amount ? revert_amount : paid_amount
        update_plot_balance(inv_revert_amount)
        inv.update(status: 'in_progress', pending_amount: inv.pending_amount + inv_revert_amount)
        cancel_transaction(inv.payment_plan_id, payment.amount)
        revert_amount -= inv_revert_amount
      end
    end

    # Debit balance from payment plan.
    #
    # @param amount [Float]
    #
    # @return [void]
    def update_plot_balance(amount)
      plan = user.payment_plans.find_by(id: payment_plan_id)
      return if plan.nil?

      plan.update_plot_balance(amount, 'debit')
    end

    # rubocop:disable Rails/SkipsModelValidations
    # Cancels invoice transaction of payment amount associated to payment plan.
    #
    # @param payment_plan_id [String] PaymentPlan#id
    # @param payment_amount [Float]
    #
    # @return [void]
    def cancel_transaction(payment_plan_id, payment_amount)
      transaction = community.wallet_transactions.not_cancelled
                            .find_by(source: 'wallet', destination: 'invoice',
                                      payment_plan_id: payment_plan_id, amount: payment_amount)
      transaction&.update_columns(status: 'cancelled')
    end
    # rubocop:enable Rails/SkipsModelValidations
  end
end
# rubocop:enable Metrics/ClassLength
