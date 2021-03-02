# frozen_string_literal: true

module Mutations
  module Transaction
    # update transactions
    class WalletTransactionUpdate < BaseMutation
      argument :id, ID, required: true
      argument :bank_name, String, required: false
      argument :cheque_number, String, required: false
      argument :transaction_number, String, required: false
      argument :status, String, required: false
      argument :source, String, required: true

      field :wallet_transaction, Types::WalletTransactionType, null: false

      def resolve(vals)
        transaction = context[:site_community].wallet_transactions.find(vals[:id])
        raise GraphQL::ExecutionError, 'Payment not found' if transaction.nil?

        ActiveRecord::Base.transaction do
          context[:current_user].generate_events('payment_update', transaction)
          return { wallet_transaction: transaction } if transaction.update!(vals)
        end
        raise GraphQL::ExecutionError, transaction.errors.full_messages
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
