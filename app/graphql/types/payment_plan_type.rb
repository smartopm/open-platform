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
    field :land_parcel, Types::LandParcelType, null: true
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
    field :outstanding_days, Integer, null: true
    field :plan_status, String, null: true
    field :upcoming_installment_due_date, GraphQL::Types::ISO8601DateTime, null: true
    field :general_payments, Float, null: false

    # Returns total amount paid for plan statement
    #
    # @return [Float]
    def statement_paid_amount
      (object.total_payments / object.installment_amount).floor * object.installment_amount
    end

    # Returns unallocated amount for plan statement
    #
    # @return [Float]
    def unallocated_amount
      object.total_payments - statement_paid_amount
    end

    def renew_date
      object.end_date - 2.months
    end

    def paid_payments_exists
      object.plan_payments.exists?(status: :paid)
    end

    # Returns total amount for general fund
    #
    # @return [Float]
    def general_payments
      object.plan_payments.paid.sum(:amount)
    end
  end
end
