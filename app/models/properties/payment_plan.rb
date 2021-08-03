# frozen_string_literal: true

module Properties
  # rubocop:disable Metrics/ClassLength
  # PaymentPlan
  class PaymentPlan < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'
    belongs_to :land_parcel
    has_many :invoices, class_name: 'Payments::Invoice', dependent: :nullify
    has_many :wallet_transactions, class_name: 'Payments::WalletTransaction', dependent: :nullify
    has_many :plan_payments, class_name: 'Payments::PlanPayment', dependent: :nullify
    has_many :plan_ownerships, dependent: :destroy
    has_many :co_owners, class_name: 'Users::User', through: :plan_ownerships, source: :user

    default_scope { where.not(status: %i[deleted general]) }

    before_create :set_pending_balance

    validates :payment_day,
              numericality: { only_integer: true, greater_than: 0, less_than_or_equal_to: 28 }
    validates :duration, numericality: { greater_than_or_equal_to: 1 }
    validates :installment_amount, numericality: { greater_than_or_equal_to: 1 }, on: :create
    validate :general_plan_existence, if: -> { status.eql?('general') }

    enum status: { active: 0, cancelled: 1, deleted: 2, completed: 3, general: 4 }
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
      save
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
    # rubocop:enable Metrics/MethodLength

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # Transfers payments on PaymentPlan to different PaymentPlan.
    #
    # @param [PaymentPlan] plan
    #
    # @return [void]
    def transfer_payments(plan)
      plan.plan_payments.paid.order(amount: :asc).each do |payment|
        new_payment = build_new_payment(plan, payment)
        if pending_balance.positive?
          if pending_balance < payment.amount
            new_payment.amount = pending_balance
            new_payment.automated_receipt_number = "#{payment.automated_receipt_number}-1"
            # rubocop:disable Layout/LineLength
            if payment.manual_receipt_number.present?
              new_payment.manual_receipt_number = "#{payment.manual_receipt_number.split('MI')[1]}-1"
            end
            # rubocop:enable Layout/LineLength
            create_split_payment(plan, payment)
          end
          update_pending_balance(new_payment.amount)
        else
          new_payment.payment_plan_id = user.general_payment_plan.id
        end
        new_payment.save!
        payment.note = "Migrated to plan #{payment_plan_name} Id - #{id}"
        payment.status = 'cancelled'
        payment.save!
      end
    end
    # rubocop:enable Metrics/MethodLength

    def build_new_payment(plan, payment)
      new_payment = plan_payments.build(payment_attributes(payment))
      new_payment.note = "Migrated from plan #{plan.payment_plan_name} Id - #{plan.id}"
      if payment.manual_receipt_number.present?
        new_payment.manual_receipt_number = payment.manual_receipt_number.split('MI')[1]
      end
      new_payment
    end

    # rubocop:disable Metrics/AbcSize
    def create_split_payment(plan, payment)
      split_payment = user.general_payment_plan.plan_payments.build(payment_attributes(payment))
      split_payment.assign_attributes(
        amount: payment.amount - pending_balance,
        automated_receipt_number: "#{payment.automated_receipt_number}-2",
        note: "Migrated from plan #{plan.payment_plan_name} Id - #{plan.id}",
      )
      if payment.manual_receipt_number.present?
        split_payment.manual_receipt_number = "#{payment.manual_receipt_number.split('MI')[1]}-2"
      end
      split_payment.save!
    end
    # rubocop:enable Metrics/AbcSize

    def payment_attributes(payment)
      payment.attributes.slice(
        'amount',
        'status',
        'transaction_id',
        'user_id',
        'community_id',
        'automated_receipt_number',
      )
    end

    # Returns PaymentPlan name by concatenating parcel number and start date.
    #
    # @return [String]
    def payment_plan_name
      "#{land_parcel.parcel_number} - #{start_date.strftime('%Y-%m-%d')}"
    end

    private

    # Assigns pending balance(product of installmemt amount & duration).
    #
    # @return [void]
    def set_pending_balance
      self.pending_balance = installmemt_amount * duration
    end

    def general_plan_existence
      if Properties::PaymentPlan.unscope(where: :status).exists?(user_id: user_id,
                                                                 status: 'general')
        errors.add(:user_id, :general_plan_exists)
      end
    end
  end
  # rubocop:enable Metrics/ClassLength
end
