# frozen_string_literal: true

module Properties
  # PaymentPlan
  class PaymentPlan < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'
    belongs_to :land_parcel
    has_many :invoices, class_name: 'Payments::Invoice', dependent: :nullify
    has_many :wallet_transactions, class_name: 'Payments::WalletTransaction', dependent: :nullify
    has_many :plan_payments, class_name: 'Payments::PlanPayment', dependent: :nullify
    has_many :plan_ownerships, dependent: :destroy
    has_many :co_owners, class_name: 'Users::User', through: :plan_ownerships, source: :user

    before_create :set_pending_balance

    validates :payment_day,
              numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 28 }

    enum status: { active: 0, cancelled: 1, deleted: 2 }
    enum frequency: { daily: 0, weekly: 1, monthly: 2, quarterly: 3 }

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
    def plan_duration
      start_date...(start_date + frequency_based_duration(duration || 12))
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

    # rubocop:disable Metrics/MethodLength
    # Returns maximum amount that can be allocated to plan.
    #
    # @param [Float] amount
    #
    # @return [Float]
    def allocated_amount(amount)
      amount > pending_balance ? pending_balance : amount
    end

    def frequency_based_duration(duration)
      case frequency
      when 'daily'
        duration.days
      when 'weekly'
        duration.weeks
      when 'monthly'
        duration.months
      when 'quarterly'
        (duration * 3).months
      else
        duration.months
      end
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
    # rubocop:enable Metrics/MethodLength

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
      self.pending_balance = installmemt_amount * duration
    end
  end
end
