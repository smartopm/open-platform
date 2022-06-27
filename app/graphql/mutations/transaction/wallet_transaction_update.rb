# frozen_string_literal: true

module Mutations
  module Transaction
    # update transactions
    class WalletTransactionUpdate < BaseMutation
      argument :id, ID, required: true
      argument :source, String, required: true
      argument :bank_name, String, required: false
      argument :cheque_number, String, required: false
      argument :transaction_number, String, required: false
      argument :status, String, required: false
      argument :created_at, String, required: false

      field :wallet_transaction, Types::WalletTransactionType, null: false

      def resolve(vals)
        transaction = context[:site_community].wallet_transactions.find_by(id: vals[:id])

        if transaction.update(vals)
          context[:current_user].generate_events('payment_update', transaction)
          return { wallet_transaction: transaction }
        end
        raise GraphQL::ExecutionError, transaction.errors.full_messages
      end

      def authorized?(_vals)
        if permitted?(module: :payment_records, permission: :can_update_wallet_transaction)
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      def raise_transaction_not_found_error(transaction)
        return if transaction

        raise GraphQL::ExecutionError, I18n.t('errors.wallet_transaction.payment_not_found')
      end
    end
  end
end
