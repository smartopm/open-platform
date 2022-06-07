# frozen_string_literal: true

module Properties
  # rubocop:disable Metrics/ClassLength
  # PaymentPlan
  class PaymentPlan < ApplicationRecord
    include SearchCop

    search_scope :search do
      attributes :status, :plan_type
      attributes name: ['user.name']
      attributes land_parcel: ['land_parcel.parcel_number']
    end

    belongs_to :user, class_name: 'Users::User'
    belongs_to :land_parcel
    has_many :invoices, class_name: 'Payments::Invoice', dependent: :nullify
    has_many :wallet_transactions, class_name: 'Payments::WalletTransaction', dependent: :nullify
    has_many :plan_payments, class_name: 'Payments::PlanPayment', dependent: :nullify
    has_many :plan_ownerships, dependent: :destroy
    has_many :co_owners, class_name: 'Users::User', through: :plan_ownerships, source: :user

    default_scope { where.not(status: :deleted) }
    scope :excluding_general_plans, lambda {
      where.not(status: :general)
    }

    before_create :set_pending_balance
    after_create :allocate_general_funds

    validates :payment_day,
              numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 28 }
    validates :duration, numericality: { greater_than_or_equal_to: 1 }
    validates :installment_amount, numericality: { greater_than_or_equal_to: 1 }, on: :create
    validate :general_plan_existence, if: -> { status.eql?('general') }

    enum status: { active: 0, cancelled: 1, deleted: 2, completed: 3, general: 4 }
    enum frequency: { daily: 0, weekly: 1, monthly: 2, quarterly: 3 }
    enum plan_type: { starter: 0, basic: 1, standard: 2, premium: 3 }

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

    def next_plan_start_date
      return unless renewable

      plan_duration.last.to_date
    end

    def within_renewable_dates?
      return unless renewable

      next_plan_start_date <= 2.months.from_now.to_date
    end

    # Cancels payment plan
    #
    # @return [Boolean]
    def cancel!
      update!(pending_balance: 0, status: :cancelled, renewable: false)
    end

    # Updates plan's pending balance and status.
    #
    # @param [Float] amount
    # @param [String] settle/revert
    #
    # @return [Boolean]
    def update_pending_balance(amount, action = :settle)
      if action.eql?(:settle)
        self.pending_balance = pending_balance - allocated_amount(amount)
        self.status = :completed if pending_balance.eql?(0)
      else
        self.status = :active if pending_balance.eql?(0)
        self.pending_balance = pending_balance + amount
      end
      save!
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
      plan.plan_payments.paid.order(amount: :asc).each do |payment|
        transfer_payment(plan, payment)
      end
    end

    # Transfers individual payment
    #
    # @param [PaymentPlan] plan
    # @param [PlanPayment] payment
    #
    # @return [Boolean]
    def transfer_payment(plan, payment)
      payment.note = "Migrated to plan #{payment_plan_name} Id - #{id}"
      payment.status = :cancelled
      payment.save!
      reload
      create_new_payment(plan, payment)
      plan.update_pending_balance(payment.amount, :revert)
    end

    # Returns PaymentPlan name by concatenating parcel number and start date.
    #
    # @return [String]
    def payment_plan_name
      "#{land_parcel.parcel_number} - #{start_date.strftime('%Y-%m-%d')}"
    end

    # Returns plan's total value
    #
    # @return [Float]
    def plan_value
      installment_amount * duration
    end

    # Returns payments expected till current date
    #
    # @return [Float]
    def expected_payments
      return 0.0 if plan_is_not_active?

      current_duration * installment_amount
    end

    # Returns the number of outstanding days for installments due
    #
    # @return [Integer]
    def outstanding_days
      return 0 if owing_amount.to_d.zero?

      last_paid_installment_due_date = start_date + frequency_based_duration(paid_installments)
      (Time.zone.today - last_paid_installment_due_date.to_date).to_i
    end

    # Returns installments due till current date
    #
    # @return [Float]
    def installments_due
      (owing_amount / installment_amount).ceil
    end

    # Returns amount which is due from the expected payments
    #
    # @return [Float]
    def owing_amount
      return 0.0 if plan_is_not_active?

      amount = expected_payments - total_payments
      amount.positive? ? amount : 0.0
    end

    # Returns total plan payments made for a plan
    #
    # @return [Float]
    def total_payments
      plan_value - pending_balance
    end

    # Returns end date for plan statement
    #
    # @return [DateTime]
    def end_date
      plan_duration.last.to_date
    end

    # Returns plan status based on owing amount if active
    #
    # @return [String]
    def plan_status
      return status unless status.eql?('active')

      owing_amount.positive? ? 'behind' : 'on_track'
    end

    # Returns upcoming installment due date
    #
    # @return [DateTime]
    def upcoming_installment_due_date
      return end_date if plan_status.eql?('completed')

      start_date + frequency_based_duration(paid_installments + 1) - 1.day
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # Allocates the general fund
    #
    # @return [void]
    def allocate_general_funds
      return if !status.eql?('active') || user.payment_plans.general.empty?

      payments = user.general_payment_plan.plan_payments.paid.order(:amount)
      payments.each do |payment|
        next if pending_balance.eql?(0)

        payment_amount = allocated_amount(payment.amount)
        if payment_amount.eql?(payment.amount)
          payment.payment_plan_id = id
          payment.note = 'Migrated from General Funds' if payment.note.blank?
          payment.save!
        else
          process_split_allocation(payment)
        end
        update_pending_balance(payment_amount)
      end
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    private

    # Assigns pending balance(product of installmemt amount & duration).
    #
    # @return [void]
    def set_pending_balance
      self.pending_balance = installment_amount * duration
    end

    # Raises error if a general land parcel already exists for a user
    #
    # @return [void]
    def general_plan_existence
      if Properties::PaymentPlan.unscope(where: :status).exists?(user_id: user_id,
                                                                 status: :general)
        errors.add(:user_id, :general_plan_exists)
      end
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # Creates new payment
    #
    # * Updates pending balance of source payment plan
    #
    # @param plan [Properties::PaymentPlan]
    # @param payment [Payments::PlanPayment]
    #
    # @return new_payment [Payments::PlanPayment]
    def create_new_payment(plan, payment)
      new_payment = plan_payments.build(payment_attributes(payment))
      new_payment.note = "Migrated from plan #{plan.payment_plan_name} Id - #{plan.id}"
      receipt_number = payment.manual_receipt_number_without_prefix
      new_payment.manual_receipt_number = receipt_number[1] if receipt_number.present?
      if pending_balance.positive?
        new_payment = process_payment(new_payment, plan, payment)
        update_pending_balance(new_payment.amount)
      else
        new_payment.payment_plan_id = user.general_payment_plan.id
      end
      new_payment.save!
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    # Processes payment
    #
    # * Assigns the split receipt number when partial payment is being used
    # * Creates payment of unused amount for general plan
    #
    # @param new_payment [Payments::PlanPayment]
    # @param plan [Properties::PaymentPlan]
    # @param payment [Payments::PlanPayment]
    #
    # @return [Boolean]
    def process_payment(new_payment, plan, payment)
      return new_payment if pending_balance >= payment.amount

      new_payment.amount = pending_balance
      new_payment.automated_receipt_number = "#{payment.automated_receipt_number}-1"
      receipt_number = payment.manual_receipt_number_without_prefix
      new_payment.manual_receipt_number = "#{receipt_number[1]}-1" if receipt_number.present?
      create_split_payment(plan, payment)
      new_payment
    end

    # rubocop:disable Metrics/AbcSize
    # Create the payment when only partial amout is used for the plan
    #
    # @param plan [Properties::PaymentPlan]
    # @param payment [Payments::PlanPayment]
    #
    # @return [Boolean]
    def create_split_payment(plan, payment)
      split_payment = user.general_payment_plan.plan_payments.build(payment_attributes(payment))
      split_payment.assign_attributes(
        amount: payment.amount - pending_balance,
        automated_receipt_number: "#{payment.automated_receipt_number}-2",
        note: "Migrated from plan #{plan.payment_plan_name} Id - #{plan.id}",
      )
      receipt_number = payment.manual_receipt_number_without_prefix
      split_payment.manual_receipt_number = "#{receipt_number[1]}-2" if receipt_number.present?
      split_payment.save!
    end
    # rubocop:enable Metrics/AbcSize

    # Returns attributes needed for the payments when transferring to another plan
    #
    # @param payment [Payments::PlanPayment]
    #
    # @return [Hash]
    def payment_attributes(payment)
      payment.attributes.slice(
        'amount',
        'transaction_id',
        'user_id',
        'community_id',
        'automated_receipt_number',
        'created_at',
      ).merge('status': 'paid')
    end

    # Returns duration based on frequency
    #
    # @param duration [Integer]
    #
    # @return [ActiveSupport::Duration]
    def frequency_based_duration(duration)
      case frequency
      when 'daily'
        duration.days
      when 'weekly'
        duration.weeks
      when 'quarterly'
        (duration * 3).months
      else
        duration.months
      end
    end

    # rubocop:disable Metrics/MethodLength
    # Returns the duration between the start date and current date
    #
    # @return [Float]
    def current_duration
      current_date = Time.zone.today > end_date ? end_date : Time.zone.today
      days = (current_date - start_date.to_date).to_i
      return 0 if days <= 0

      case frequency
      when 'daily'
        days
      when 'weekly'
        days / 7
      when 'quarterly'
        days / 90
      else
        days / 30
      end
    end

    # rubocop:enable Metrics/MethodLength
    # Returns the total paid installments
    #
    # @return [Integer]
    def paid_installments
      (total_payments / installment_amount).floor
    end

    # Returns true if plan is not active or the plan has not started
    #
    # @return [Boolean]
    def plan_is_not_active?
      return true if !status.eql?('active') || start_date.to_date > Time.zone.today
    end

    # Splits the general payment and cancels the general payment entry
    #
    # @return [void]
    def process_split_allocation(payment)
      create_new_payment_for_allocation(payment)
      create_general_payment(payment)
      payment.cancelled!
    end

    # Creates payment for the plan with amount of the pending balance
    #
    # @return [void]
    def create_new_payment_for_allocation(payment)
      new_payment = payment.dup
      new_payment.assign_attributes(
        amount: pending_balance,
        payment_plan_id: id,
        created_at: payment.created_at,
      )
      new_payment.note = 'Migrated from General Funds' if payment.note.blank?
      update_receipt_numbers(new_payment, payment, 1)
      new_payment.save!
    end

    # Creates payment for the general fund with remaining amount
    #
    # @return [void]
    def create_general_payment(payment)
      general_payment = payment.dup
      general_payment.assign_attributes(
        amount: payment.amount - pending_balance,
        payment_plan: user.general_payment_plan,
        created_at: payment.created_at,
      )
      update_receipt_numbers(general_payment, payment, 2)
      general_payment.save!
    end

    # Updates receipt number with -1 or -2
    #
    # @return [void]
    def update_receipt_numbers(new_payment, payment, number)
      receipt_number = payment.manual_receipt_number_without_prefix
      if receipt_number.present?
        new_payment.manual_receipt_number = "#{receipt_number[1]}-#{number}"
      end
      new_payment.automated_receipt_number = "#{payment.automated_receipt_number}-#{number}"
    end
  end
  # rubocop:enable Metrics/ClassLength
end
