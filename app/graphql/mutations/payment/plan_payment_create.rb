# frozen_string_literal: true

module Mutations
  module Payment
    # Creates new plan payment using unallocated amount
    class PlanPaymentCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :transaction_id, ID, required: true
      argument :payment_plan_id, ID, required: true
      argument :amount, Float, required: true

      field :payment, Types::PlanPaymentType, null: true

      # rubocop:disable Metrics/AbcSize
      # Creates new plan payment
      # * Creates user payment entry
      # * Updates payment plan's pending balance
      #
      # @param values [Hash]
      #
      # @return [Hash]
      def resolve(values)
        context[:transaction] = Payments::Transaction.find_by(id: values[:transaction_id])
        raise_transaction_not_found_error
        context[:payment_plan] = Properties::PaymentPlan.find_by(id: values[:payment_plan_id])

        unallocated_amount = context[:transaction].unallocated_amount
        raise_amount_not_sufficient_error(values[:amount], unallocated_amount)

        create_payment(values)
        { payment: context[:payment].reload }
      end
      # rubocop:enable Metrics/AbcSize

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :plan_payment, permission: :can_create_plan_payment)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      # Creates plan payment made by user.
      #
      # @param values [Hash]
      #
      # @return [void]
      def create_payment(values)
        allocated_amount = context[:payment_plan].allocated_amount(values[:amount])
        payment_attributes = values.except(:land_parcel_id)
                                   .merge(
                                     status: 'paid',
                                     community_id: context[:site_community].id,
                                     payment_plan_id: context[:payment_plan].id,
                                     amount: allocated_amount,
                                   )
        context[:payment] = Payments::PlanPayment.create(payment_attributes)
        raise_payment_validation_error

        context[:payment].payment_plan.update_pending_balance(allocated_amount)
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      # Raises GraphQL execution error if transaction does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_transaction_not_found_error
        return if context[:transaction]

        raise GraphQL::ExecutionError, I18n.t('errors.transaction.not_found')
      end

      # Raises GraphQL execution error if amount is more than unallocated amount.
      #
      # @return [GraphQL::ExecutionError]
      def raise_amount_not_sufficient_error(amount, unallocated_amount)
        return if unallocated_amount >= amount

        raise GraphQL::ExecutionError, I18n.t('errors.transaction.amount_not_sufficient')
      end

      # Raises GraphQL execution error if payment is not saved.
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_validation_error
        return if context[:payment].persisted?

        raise GraphQL::ExecutionError, context[:payment].errors.full_messages&.join(', ')
      end
    end
  end
end
