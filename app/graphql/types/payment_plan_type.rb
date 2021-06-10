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
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :payment_day, Integer, null: false
    field :monthly_amount, Float, null: true
    field :plan_payments, [Types::PlanPaymentType], null: true
    field :statement_pending_balance, Float, null: false
    field :plan_value, Float, null: false
    field :statement_paid_amount, Float, null: false
    field :unallocated_amount, Float, null: false
    field :duration_in_month, Integer, null: false

    # Returns pending balance for plan statement
    #
    # @return [Float]
    def statement_pending_balance
      plan_value - statement_paid_amount
    end

    # Returns plan's total value
    #
    # @return [Float]
    def plan_value
      object.monthly_amount * object.duration_in_month
    end

    # Returns total amount paid for plan statement
    #
    # @return [Float]
    def statement_paid_amount
      payment_amount = object.plan_payments.not_cancelled.sum(:amount)
      (payment_amount / object.monthly_amount).floor * object.monthly_amount
    end

    # Returns unallocated amount for plan statement
    #
    # @return [Float]
    def unallocated_amount
      object.plan_payments.not_cancelled.sum(:amount) - statement_paid_amount
    end
  end
end
