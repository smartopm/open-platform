# frozen_string_literal: true

module Properties
  # PaymentPlan
  class PaymentPlan < ApplicationRecord

    enum status: { active: 0, cancelled: 1, deleted: 2 }

    belongs_to :user, class_name: 'Users::User'
    belongs_to :land_parcel
    has_many :invoices, class_name: 'Payments::Invoice', dependent: :nullify
    has_many :wallet_transactions, class_name: 'Payments::WalletTransaction', dependent: :nullify

    validates :payment_day,
              numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 28 }
    validate :plan_uniqueness_per_duration

    after_create :generate_monthly_invoices

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
      start_date..(start_date + (duration_in_month || 12).month)
    end

    private

    def generate_monthly_invoices
      return if monthly_amount.nil? || monthly_amount.zero?

      no_of_invoices = duration_in_month || 12
      no_of_invoices.times do |index|
        create_invoice_for_month(monthly_amount, start_date + index.month)
      end
    end

    def create_invoice_for_month(amount, date)
      invoices.create!({
                         land_parcel: land_parcel,
                         amount: amount,
                         community: user.community,
                         autogenerated: true,
                         status: 'in_progress',
                         due_date: date + 1.month,
                         user: user,
                       })
    end

    # Validates whether payment plan is unique per duration.
    # * adds error if payment plan overlaps with other payment plan.
    #
    # @return [Array]
    #
    # @todo Change association between land parcel and payment to many-to-many.
    # @todo Use 'land_parcel.payment_plans' once establish many-to-many association.
    def plan_uniqueness_per_duration
      plans = PaymentPlan.where(land_parcel_id: land_parcel_id).where.not(id: id)
      is_overlapping = plans.any? { |plan| duration.overlaps?(plan.duration) }
      return unless is_overlapping

      errors.add(:start_date, 'Payment plan duration overlaps with other payment plans')
    end
  end
end
