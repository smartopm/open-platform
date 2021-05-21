# frozen_string_literal: true

# PaymentPlan
class PaymentPlan < ApplicationRecord
  belongs_to :user
  belongs_to :land_parcel
  has_many :invoices, dependent: :nullify
  has_many :wallet_transactions, dependent: :nullify
  has_many :plan_payments, dependent: :nullify

  after_create :generate_monthly_invoices

  validates :payment_day,
            numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 28 }

  validate :plan_uniqueness_per_duration

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

  # Reduces plan's pending balance with allocated amount.
  #
  # @param [Float] amount
  #
  # @return [Boolean]
  def update_pending_balance(amount)
    update!(pending_balance: pending_balance - allocated_amount(amount))
  end

  # Returns maximum amount that can be allocated to plan.
  #
  # @param [Float] amount
  #
  # @return [Float]
  def allocated_amount(amount)
    amount > pending_balance ? pending_balance : amount
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
  # Todo:- Change association between land parcel and payment to many-to-many.
  # Todo:- Use 'land_parcel.payment_plans' once establish many-to-many association.
  def plan_uniqueness_per_duration
    plans = PaymentPlan.where(land_parcel_id: land_parcel_id).where.not(id: id)
    is_overlapping = plans.any? { |plan| duration.overlaps?(plan.duration) }
    return unless is_overlapping

    errors.add(:start_date, :plan_overlaps_with_other_plan)
  end
end
