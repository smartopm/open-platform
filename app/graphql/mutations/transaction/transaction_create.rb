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
          land_parcel = context[:site_community].land_parcels.find_by(id: values[:land_parcel_id])
          context[:payment_plan] = land_parcel.payment_plan

          create_user_transaction(values)
          raise_transaction_validation_error
          context[:transaction].execute_transaction_callbacks(context[:payment_plan])
          { transaction: context[:transaction] }
        end
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Creates deposits made by user.
      #
      # @param values [Hash]
      #
      # @return [void]
      def create_user_transaction(values)
        user = context[:site_community].users.find_by(id: values[:user_id])

        transaction_attributes = values.except(:land_parcel_id)
                                       .merge(
                                         status: 'accepted',
                                         community_id: context[:site_community]&.id,
                                         depositor_id: context[:current_user].id,
                                         originally_created_at: user.current_time_in_timezone,
                                       )
        context[:transaction] = Transaction.create(transaction_attributes)
      end

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
