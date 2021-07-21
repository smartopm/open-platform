# frozen_string_literal: true

module Types
  # PaymentPlanType
  class PaymentPlanType < Types::BaseObject
    field :id, ID, null: false
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
      payment_amount = object.plan_payments.not_cancelled.sum(:amount)
      (payment_amount / object.installment_amount).floor * object.installment_amount
    end

    # Returns unallocated amount for plan statement
    #
    # @return [Float]
    def unallocated_amount
      object.plan_payments.not_cancelled.sum(:amount) - statement_paid_amount
    end

    # Returns end date for plan statement
    #
    # @return [DateTime]
    def end_date
      object.start_date + object.frequency_based_duration(object.duration)
    end
  end
end
