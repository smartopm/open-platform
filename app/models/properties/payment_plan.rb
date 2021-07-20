# frozen_string_literal: true

module Properties
  # PaymentPlan
  class PaymentPlan < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'
    belongs_to :land_parcel
    has_many :invoices, class_name: 'Payments::Invoice', dependent: :nullify
    has_many :wallet_transactions, class_name: 'Payments::WalletTransaction', dependent: :nullify
    has_many :plan_payments, class_name: 'Payments::PlanPayment', dependent: :nullify

    before_create :set_pending_balance

    validates :payment_day,
              numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 28 }

    enum status: { active: 0, cancelled: 1, deleted: 2 }

    has_paper_trail

    def update_plot_balance(amount, type = 'credit')
      return if amount.zero?

      type.eql?('credit') ? update(plot_balance: plot_balance + amount) : debit_plot_balance(amount)
    end

    def debit_plot_balance(amount)
      if amount > plot_balance
        update(plot_balance: 0, pending_balance: pending_balance + amount - plot_balance)
      else
        update(plot_balance: plot_balance - amount)
      end
    end

    # Returns payment plan duration (start and end date of plan).
    #
    # @return [Range]
    def duration
      start_date...(start_date + (duration_in_month || 12).month)
    end

    # Cancels payment plan
    #
    # @return [Boolean]
    def cancel!
      update!(pending_balance: 0, status: 1)
    end

    # Updates plan's pending balance.
    #
    # @param [Float] amount
    # @param [String] settle/revert
    #
    # @return [Boolean]
    def update_pending_balance(amount, action = :settle)
      if action.eql?(:settle)
        update!(pending_balance: pending_balance - allocated_amount(amount))
      else
        update!(pending_balance: pending_balance + amount)
      end
    end

    # Returns maximum amount that can be allocated to plan.
    #
    # @param [Float] amount
    #
    # @return [Float]
    def allocated_amount(amount)
      amount > pending_balance ? pending_balance : amount
    end

    # Transfers payments on PaymentPlan to different PaymentPlan.
    #
    # @param [PaymentPlan] plan
    #
    # @return [void]
    def transfer_payments(plan)
      plan.plan_payments.each do |payment|
        payment_attributes = payment.attributes.slice(
          'amount',
          'status',
          'transaction_id',
          'user_id',
          'community_id'
        )
        new_payment = plan_payments.build(payment_attributes)
        new_payment.note = "transfer from plan #{plan.payment_plan_name}"
        new_payment.save
        payment.note = "transfer to plan #{payment_plan_name}"
        payment.cancelled!
      end
      update_pending_balance(plan_payments.sum(:amount))
    end

    # Returns PaymentPlan name by concatenating parcel number and start date.
    #
    # @return [String]
    def payment_plan_name
      "#{land_parcel.parcel_number} - #{start_date.strftime('%Y-%m-%d')}"
    end

    private

    # Assigns pending balance(product of monthly amount & duration_in_month).
    #
    # @return [void]
    def set_pending_balance
      self.pending_balance = monthly_amount * duration_in_month
    end
  end
end
