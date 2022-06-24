# frozen_string_literal: true

module Mutations
  module Transaction
    # update transactions
    class WalletTransactionRevert < BaseMutation
      argument :id, ID, required: true

      field :wallet_transaction, Types::WalletTransactionType, null: false

      def resolve(id:)
        transaction = context[:site_community].wallet_transactions.find_by(id: id)
        raise_error_transaction_can_not_be_reverted(transaction)

        return { wallet_transaction: transaction.reload } if transaction.cancelled!

        raise GraphQL::ExecutionError, transaction.errors.full_messages&.join(', ')
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        if permitted?(module: :transaction_plan, permission: :can_revert_wallet_transaction)
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises error if transaction or payment plan is not present.
      def raise_error_transaction_can_not_be_reverted(transaction)
        return if transaction.present? && transaction.payment_plan.present?

        raise GraphQL::ExecutionError, I18n.t('errors.wallet_transaction.can_not_revert')
      end
    end
  end
end
