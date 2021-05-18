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

  has_paper_trail

  # Creates payment entry against transaction and payment plan
  #
  # @param [String] PaymentPlan#uuid
  # @param [Float] payable_amount
  #
  # @return [void]
  def create_plan_payment(payment_plan_id, payable_amount)
    plan_payments.create!(
                          user_id: user.id,
                          community_id: community.id,
                          amount: payable_amount,
                          status: 'paid',
                          payment_plan_id: payment_plan_id,
                          created_at: created_at,
                          )
  
  end

  

  # Performs actions post transaction creation.
  # * Creates payment entry against payment plan
  # * Updates payment plan's pending balance
  #
  # @param [Hash] args
  # @option args [payment_plan] PaymentPlan
  # @option args [amount] Float
  #
  # @return [void]
  def execute_transaction_callbacks(args = {})
    create_plan_payment(args[:payment_plan].id, args[:payable_amount])
    args[:payment_plan].pending_balance -= args[:payable_amount]
    args[:payment_plan].save!
  end
end
