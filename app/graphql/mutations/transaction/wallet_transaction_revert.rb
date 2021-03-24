# frozen_string_literal: true

module Mutations
  module Transaction
    # update transactions
    class WalletTransactionRevert < BaseMutation
      argument :id, ID, required: true

      field :wallet_transaction, Types::WalletTransactionType, null: false

      def resolve(id:)
        transaction = context[:site_community].wallet_transactions.find_by(id: id)
        raise GraphQL::ExecutionError, 'Transaction not found' if transaction.nil?

        return { wallet_transaction: transaction.reload } if transaction.cancelled!

        raise GraphQL::ExecutionError, transaction.errors.full_messages
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
