# frozen_string_literal: true

module Types
  # Wallet Transaction Type
  class TransactionType < Types::BaseObject
    field :id, ID, null: false
    field :source, String, null: false
    field :amount, Float, null: false
    field :status, String, null: false
    field :bank_name, String, null: true
    field :cheque_number, String, null: true
    field :transaction_number, String, null: true
    field :user, Types::UserType, null: false
    field :depositor, Types::UserType, null: true
    field :community, Types::CommunityType, null: false
    field :plan_payments, [Types::PlanPaymentType], null: true
    field :created_at, Types::Scalar::DateType, null: false
    field :updated_at, Types::Scalar::DateType, null: false
    field :originally_created_at, Types::Scalar::DateType, null: false
    field :allocated_amount, Float, null: false
    field :unallocated_amount, Float, null: false

    # Returns allocated amount for the payment plan
    #
    # @return [Float] unallocated_amount
    def unallocated_amount
      object.amount - allocated_amount
    end

    # Returns the unallocated amount after payment is made for payment plan
    #
    # @return [Float] allocated_amount
    def allocated_amount
      object.plan_payments.not_cancelled.pluck(:amount).sum
    end
  end
end
