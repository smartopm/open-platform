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
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :depositor, Types::UserType, null: true,
                                       resolve: Resolvers::BatchResolver.load(:depositor)
    field :community, Types::CommunityType, null: false,
                                            resolve: Resolvers::BatchResolver.load(:community)
    field :plan_payments, [Types::PlanPaymentType],
          null: true,
          resolve: Resolvers::BatchResolver.load(:plan_payments)
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :originally_created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :allocated_amount, Float, null: false
    field :unallocated_amount, Float, null: false

    # Returns allocated amount for the payment plan
    #
    # @return [Float] unallocated_amount
    def unallocated_amount
      batch_load(object, :plan_payments).then do |plan_payments|
        object.amount - total_amount(plan_payments)
      end
    end

    # Returns the unallocated amount after payment is made for payment plan
    #
    # @return [Float] allocated_amount
    def allocated_amount
      batch_load(object, :plan_payments).then do |plan_payments|
        total_amount(plan_payments)
      end
    end

    def total_amount(plan_payments)
      sum = 0.0
      plan_payments.compact.select do |plan_payment|
        sum += plan_payment.amount if plan_payment.status.eql?('paid')
      end
      sum
    end
  end
end
