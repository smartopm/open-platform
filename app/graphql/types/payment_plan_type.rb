# frozen_string_literal: true

module Types
  # PaymentPlanType
  class PaymentPlanType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :status, String, null: true
    field :plan_type, String, null: true
    field :percentage, String, null: true
    field :plot_balance, Float, null: true
    field :pending_balance, Float, null: true
    field :land_parcel, Types::LandParcelType, null: false
    field :invoices, [Types::InvoiceType], null: false
    field :user, Types::UserType, null: false
    field :start_date, GraphQL::Types::ISO8601DateTime, null: true
    field :end_date, GraphQL::Types::ISO8601DateTime, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :payment_day, Integer, null: false
    field :installment_amount, Float, null: true
    field :plan_payments, [Types::PlanPaymentType], null: true
    field :plan_value, Float, null: false
    field :statement_paid_amount, Float, null: false
    field :unallocated_amount, Float, null: false
    field :duration, Integer, null: false
    field :frequency, String, null: true
    field :co_owners, [Types::UserType], null: true
    field :paid_payments_exists, Boolean, null: true
    field :renewable, Boolean, null: true
    field :renew_date, GraphQL::Types::ISO8601DateTime, null: true
    field :total_payments, Float, null: true
    field :expected_payments, Float, null: true
    field :owing_amount, Float, null: true
    field :installments_due, Integer, null: true

    # Returns plan's total value
    #
    # @return [Float]
    def plan_value
      object.installment_amount * object.duration
    end

    # Returns total amount paid for plan statement
    #
    # @return [Float]
    def statement_paid_amount
      (total_payments / object.installment_amount).floor * object.installment_amount
    end

    # Returns unallocated amount for plan statement
    #
    # @return [Float]
    def unallocated_amount
      total_payments - statement_paid_amount
    end

    # Returns payments expected till current date
    #
    # @return [Float]
    def expected_payments
      if !object.status.eql?('active') || object.start_date.to_date > Time.zone.today
        0
      else
        current_duration * object.installment_amount
      end
    end

    # Returns installments due till current date
    #
    # @return [Float]
    def installments_due
      (owing_amount / object.installment_amount).ceil
    end

    # Returns amount which is due from the expected payments
    #
    # @return [Float]
    def owing_amount
      if !object.status.eql?('active') || object.start_date.to_date > Time.zone.today
        0
      else
        amount = expected_payments - total_payments
        amount.positive? ? amount : 0
      end
    end

    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    # Returns the duration between the start date and current date
    #
    # @return [Float]
    def current_duration
      days = (Time.zone.today - object.start_date.to_date).to_i
      return 0 if days <= 0

      case object.frequency
      when 'daily'
        days
      when 'weekly'
        (days / 7.0).ceil
      when 'monthly'
        (days / 30.0).ceil
      when 'quarterly'
        (days / 90.0).ceil
      else
        (days / 30.0).ceil
      end
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    # Returns total plan payments made for a plan
    #
    # @return [Float]
    def total_payments
      object.plan_payments.not_cancelled.sum(:amount)
    end

    def renew_date
      end_date - 2.months
    end

    # Returns end date for plan statement
    #
    # @return [DateTime]
    def end_date
      object.start_date + object.frequency_based_duration(object.duration)
    end

    def paid_payments_exists
      object.plan_payments.exists?(status: :paid)
    end
  end
end
