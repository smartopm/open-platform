# frozen_string_literal: true

module Mutations
  module Transaction
    # Create transactions against user
    class TransactionCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :amount, Float, required: true
      argument :source, String, required: true
      argument :bank_name, String, required: false
      argument :cheque_number, String, required: false
      argument :transaction_number, String, required: false
      argument :created_at, String, required: false
      argument :payments_attributes, [Types::PlanPaymentInput], required: true

      field :transaction, Types::TransactionType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      # Creates new Transaction(Deposit).
      # * Creates user's deposit entry.
      # * Creates payment entries against payment plan
      # * Updates PaymentPlan's pending balance,
      #
      # @param values [Hash]
      #
      # @return [Hash]
      def resolve(values)
        ActiveRecord::Base.transaction do
          raise_total_amount_mismatch_error(values[:amount], values[:payments_attributes])

          create_user_transaction(values)
          raise_transaction_validation_error

          values[:payments_attributes].each do |input|
            payment_plan = Properties::PaymentPlan.find_by(id: input[:payment_plan_id])
            raise_payment_plan_related_errors(payment_plan, input[:amount])
            raise_receipt_number_validation_error(input[:receipt_number])

            context[:transaction].execute_transaction_callbacks(payment_plan, input[:amount],
                                                                input[:receipt_number])
          end

          { transaction: context[:transaction].reload }
        end
      end
      # rubocop:enable Metrics/MethodLength

      # rubocop:enable Metrics/AbcSize
      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if transation amount is not equal to the plan allocated
      # amounts
      #
      # @param amount [Float]
      # @param inputs [Hash]
      def raise_total_amount_mismatch_error(amount, inputs)
        total_amount_for_plans = inputs.reduce(0) { |sum, input| sum + input[:amount] }
        return if amount.eql?(total_amount_for_plans)

        raise GraphQL::ExecutionError, I18n.t('errors.transaction.amount_should_be_same')
      end

      # Raises GraphQL execution error
      # * If payment plan does not exist
      # * If amount is more than the pending balance
      #
      # @return [GraphQL::ExecutionError]
      def raise_payment_plan_related_errors(payment_plan, amount)
        raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.not_found') if payment_plan.nil?

        return if payment_plan.pending_balance >= amount

        # rubocop:disable Layout/LineLength
        raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.amount_greater_than_pending_balance')
        # rubocop:enable Layout/LineLength
      end

      # Raises GraphQL execution error if a payment with same receipt number already exists
      #
      # @param receipt_number [String]
      # @return [GraphQL::ExecutionError]
      def raise_receipt_number_validation_error(receipt_number)
        return if receipt_number.nil?

        payment_exists = Payments::PlanPayment.exists?(
          manual_receipt_number: "MI#{receipt_number}",
          community_id: context[:site_community].id,
        )
        return unless payment_exists

        raise GraphQL::ExecutionError, I18n.t('errors.receipt_number.already_exists')
      end

      # rubocop:disable Metrics/AbcSize
      # Creates deposits made by user.
      #
      # @param values [Hash]
      #
      # @return [void]
      def create_user_transaction(values)
        user = context[:site_community].users.find_by(id: values[:user_id])

        transaction_attributes = values.except(:payments_attributes)
                                       .merge(
                                         status: 'accepted',
                                         community_id: context[:site_community]&.id,
                                         depositor_id: context[:current_user].id,
                                         originally_created_at: user.current_time_in_timezone,
                                       )
        context[:transaction] = Payments::Transaction.create(transaction_attributes)
      end
      # rubocop:enable Metrics/AbcSize

      # Raises GraphQL execution error if transaction is not saved.
      #
      # @return [GraphQL::ExecutionError]
      def raise_transaction_validation_error
        return if context[:transaction].persisted?

        raise GraphQL::ExecutionError, context[:transaction].errors.full_messages&.join(', ')
      end
    end
  end
end
