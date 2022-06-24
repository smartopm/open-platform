# frozen_string_literal: true

module Mutations
  module Transaction
    # Revert transaction and cancel associated payment entries.
    class TransactionRevert < BaseMutation
      argument :id, ID, required: true

      field :transaction, Types::TransactionType, null: false

      def resolve(id:)
        transaction = context[:site_community].transactions.find_by(id: id)
        raise_transaction_not_found_error(transaction)

        return { transaction: transaction.reload } if transaction.cancelled!

        raise GraphQL::ExecutionError, transaction.errors.full_messages&.join(', ')
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :transaction_plan, permission: :can_revert_transaction)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      def raise_transaction_not_found_error(transaction)
        return if transaction.present?

        raise GraphQL::ExecutionError, I18n.t('errors.transaction.not_found')
      end
    end
  end
end
