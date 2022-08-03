# frozen_string_literal: true

module Payments
  # Manages deposits record of user.
  class Transaction < ApplicationRecord
    include SearchCop

    VALID_SOURCES = %w[cash cheque/cashier_cheque wallet mobile_money invoice
                       bank_transfer/eft bank_transfer/cash_deposit pos].freeze

    enum status: { accepted: 0, pending: 1, denied: 2, cancelled: 3 }

    belongs_to :community
    belongs_to :user, class_name: 'Users::User'
    belongs_to :depositor, class_name: 'Users::User', optional: true
    has_many :plan_payments, inverse_of: :user_transaction, dependent: :destroy

    validates :source, inclusion: { in: VALID_SOURCES, allow_nil: false }
    validates :bank_name, :cheque_number, presence: true,
                                          if: -> { source.eql?('cheque/cashier_cheque') }
    validates :transaction_number, uniqueness: true, length: { maximum: 35, allow_blank: true },
                                   if: -> { transaction_number.present? }
    validates :amount, numericality: { greater_than: 0 }

    after_update :revert_payments, if: -> { saved_changes.key?('status') && cancelled? }

    has_paper_trail

    search_scope :search do
      attributes :source, :created_at, :transaction_number, :cheque_number
      attributes user: ['user.name']
      attributes phone_number: ['user.phone_number']
      attributes email: ['user.email']
    end

    # Performs actions post transaction creation.
    # * Creates payment entry against payment plan
    # * Updates payment plan's pending balance
    #
    # @param [PaymentPlan] PaymentPlan
    # @param [String] receipt_number
    #
    # @return [void]
    def execute_transaction_callbacks(payment_plan, amount, receipt_number)
      plan_allocated_amount = payment_plan.allocated_amount(amount)

      payment_plan.update_pending_balance(amount)
      create_plan_payment(payment_plan, plan_allocated_amount, receipt_number)
      create_general_payment(amount - plan_allocated_amount)
    end

    # Returns unallocated amount for the transaction
    #
    # @return [Float]
    def unallocated_amount
      amount - plan_payments.not_cancelled.pluck(:amount).sum
    end

    # rubocop:disable Metrics/MethodLength
    def self.payment_stat(com)
      Transaction.connection.select_all(
        sanitize_sql(
          "select
          date(transactions.created_at at time zone 'utc' at time zone '#{com.timezone}')
          as trx_date,
          sum(CASE WHEN transactions.source='cash'
          THEN transactions.amount ELSE 0 END) as cash,
          sum(CASE WHEN transactions.source='mobile_money'
          THEN transactions.amount ELSE 0 END) as mobile_money,
          sum(CASE WHEN transactions.source='pos'
          THEN transactions.amount ELSE 0 END) as pos,
          sum(CASE WHEN transactions.source='bank_transfer/cash_deposit'
          THEN transactions.amount ELSE 0 END) as bank_transfer,
          sum(CASE WHEN transactions.source='bank_transfer/eft'
          THEN transactions.amount ELSE 0 END) as eft
        from transactions
        where transactions.community_id='#{com.id}'
        and transactions.created_at > (CURRENT_TIMESTAMP - interval '365 days')
        group by trx_date order by trx_date",
        ),
      )
    end
    # rubocop:enable Metrics/MethodLength

    private

    # Reverts user transaction.
    # * Cancels all associated payment entries
    # * Revert the PaymentPlan balance with sum of payments amount.
    #
    # @return [void]
    # rubocop:disable Rails/SkipsModelValidations
    def revert_payments
      payment_plans = user.payment_plans
                          .joins(:plan_payments)
                          .where(plan_payments: { status: 'paid', transaction_id: id })
                          .distinct
      payment_plans.each do |plan|
        plan_payments = plan.plan_payments.not_cancelled.where(transaction_id: id)
        plan.update_pending_balance(plan_payments.sum(:amount), :revert)
        plan_payments.update_all(status: :cancelled)
      end
    end
    # rubocop:enable Rails/SkipsModelValidations

    # Creates payment entry against transaction and payment plan
    #
    # @param [String] PaymentPlan#uuid
    # @param [Float] allocated_amount
    # @param [String] Receipt Number
    #
    # @return [void]
    def create_plan_payment(payment_plan, amount_paid, receipt_number)
      return if amount_paid.to_d.zero?

      plan_payments.create!(
        user_id: user_id,
        community_id: community_id,
        amount: amount_paid,
        status: 'paid',
        payment_plan_id: payment_plan.id,
        created_at: created_at,
        manual_receipt_number: receipt_number,
      )
    end

    def create_general_payment(amount)
      return if amount.to_d.zero?

      general_plan = user.general_payment_plan
      plan_payments.create!(
        user_id: user_id,
        community_id: community_id,
        amount: amount,
        status: 'paid',
        payment_plan: general_plan,
        created_at: created_at,
      )
    end
  end
end
