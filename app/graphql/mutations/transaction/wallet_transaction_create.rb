# frozen_string_literal: true

module Mutations
  module Transaction
    # Create transactions against wallet
    class WalletTransactionCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :amount, Float, required: true
      argument :source, String, required: true
      argument :bank_name, String, required: false
      argument :cheque_number, String, required: false
      argument :transaction_number, String, required: false
      argument :status, String, required: false

      field :wallet_transaction, Types::WalletTransactionType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        ActiveRecord::Base.transaction do
          user = context[:site_community].users.find_by(id: vals[:user_id]) ||
                 context[:current_user]
          transaction = user.wallet_transactions.create!(
            vals.except(:user_id).merge({
                                          destination: 'wallet',
                                          status: 'settled',
                                          community_id: context[:site_community]&.id,
                                        }),
          )
          context[:current_user].generate_events('deposit_create', transaction)
          update_wallet_balance(user, transaction, vals[:amount]) if transaction.settled?
          return { wallet_transaction: transaction } if transaction.persisted?
        end
        raise GraphQL::ExecutionError, transaction.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def update_wallet_balance(user, transaction, amount)
        transaction.update(current_wallet_balance: user.wallet.balance + amount)
        user.wallet.update_balance(amount)
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
