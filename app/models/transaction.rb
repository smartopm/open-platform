# frozen_string_literal: true

# Manages deposits record of user.
class Transaction < ApplicationRecord
  VALID_SOURCES = %w[cash cheque/cashier_cheque wallet mobile_money invoice
                     bank_transfer/eft bank_transfer/cash_deposit pos
                     unallocated_funds].freeze

  enum status: { accepted: 0, pending: 1, denied: 2, cancelled: 3 }

  belongs_to :community
  belongs_to :user
  belongs_to :depositor, class_name: 'User', optional: true
  has_many :plan_payments, inverse_of: :user_transaction, dependent: :destroy

  validates :source, inclusion: { in: VALID_SOURCES, allow_nil: false }
  validates :bank_name, :cheque_number, presence: true,
                                        if: -> { source.eql?('cheque/cashier_cheque') }
  validates :transaction_number, uniqueness: true, length: { maximum: 35, allow_blank: true },
                                 if: -> { transaction_number.present? }
  validates :amount, numericality: { greater_than: 0 }

  after_update :revert_payments, if: -> { saved_changes.key?('status') && cancelled? }

  has_paper_trail

  # Performs actions post transaction creation.
  # * Creates payment entry against payment plan
  # * Updates payment plan's pending balance
  #
  # @param [payment_plan] PaymentPlan
  #
  # @return [void]
  def execute_transaction_callbacks(payment_plan, receipt_number)
    amount_paid = payment_plan.allocated_amount(amount)

    payment_plan.update_pending_balance(amount)
    create_plan_payment(payment_plan, amount_paid, receipt_number)
  end

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
  #
  # @return [void]
  def create_plan_payment(payment_plan, amount_paid, receipt_number)
    ap receipt_number
    puts "RCPT"
    plan_payments.create!(
      user_id: user_id,
      community_id: community_id,
      amount: amount_paid,
      status: 'paid',
      payment_plan_id: payment_plan.id,
      created_at: created_at,
      manual_receipt_number: receipt_number
    )
  end
end
