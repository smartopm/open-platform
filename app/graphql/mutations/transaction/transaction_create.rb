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
      argument :status, String, required: false
      argument :land_parcel_id, ID, required: true
      argument :created_at, String, required: false

      field :transaction, Types::TransactionType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      # Graphql Resolver to create new Transaction.
      # Creates Transaction, updates selected PaymentPlan's pending balance,
      # create PlanPayment entries
      #
      # @param values [Hash]
      #
      # @return Transaction
      def resolve(values)
        ActiveRecord::Base.transaction do
          context[:user] = context[:site_community].users.find_by(id: values[:user_id])
          land_parcel = context[:site_community].land_parcels.find_by(id: values[:land_parcel_id])
          context[:payment_plan] = land_parcel.payment_plan
          transaction_attributes = values.except(:land_parcel_id, :user_id)
                                         .merge(
                                           status: 'accepted',
                                           community_id: context[:site_community]&.id,
                                           depositor_id: context[:current_user].id,
                                           originally_created_at: context[:user].current_time_in_timezone,
                                         )
          context[:transaction] = context[:user].transactions.create!(transaction_attributes)
          raise_transaction_validation_error
          pending_balance = context[:payment_plan].pending_balance
          payable_amount = pending_balance > values[:amount] ? values[:amount] : pending_balance
          context[:transaction].execute_transaction_callbacks(
            payment_plan: context[:payment_plan],
            payable_amount: payable_amount,
          )
          { transaction: context[:transaction].reload }
        end
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      private

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
