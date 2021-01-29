# frozen_string_literal: true

module Mutations
  module Transaction
    # Create transactions against wallet
    class WalletTransactionCreate < BaseMutation
      argument :user_id, ID, required: false
      argument :amount, Float, required: true
      argument :source, String, required: true
      argument :destination, String, required: true
      argument :bank_name, String, required: false
      argument :cheque_number, String, required: false
      argument :status, String, required: false

      field :wallet_transaction, Types::WalletTransactionType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        ActiveRecord::Base.transaction do
          user = context[:site_community].users.find_by(id: vals[:user_id]) ||
                 context[:current_user]
          transaction = user.wallet_transactions.create!(vals.except(:user_id))
          transaction.settled! if vals[:source] == 'cash'
          update_wallet_balance(user, vals[:amount], transaction) if transaction.settled?
          return { wallet_transaction: transaction } if transaction.persisted?
        end
        raise GraphQL::ExecutionError, transaction.errors.full_messages
      end

      # rubocop:enable Metrics/AbcSize
      def update_wallet_balance(user, amount, transaction)
        balance = user.wallet.update_balance(amount)
        transaction.update(current_wallet_balance: balance)
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
