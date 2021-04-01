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
      argument :land_parcel_id, ID, required: true
      argument :receipt_number, String, required: false
      argument :created_at, String, required: false

      field :wallet_transaction, Types::WalletTransactionType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      # Graphql Resolver to create new WalletTransaction.
      # Creates WalletTransaction and update balance in Wallet and PaymentPlan of User.
      def resolve(vals)
        ActiveRecord::Base.transaction do
          site_community = context[:site_community]
          current_user = context[:current_user]

          user = site_community.users.find_by(id: vals[:user_id])

          transaction_attributes = vals.except(:user_id, :land_parcel_id)
            .merge(
              destination: 'wallet',
              status: 'settled',
              community_id: site_community&.id,
              depositor_id: current_user.id
            )
          transaction = user.wallet_transactions.create(transaction_attributes)

          if transaction.persisted?
            current_user.generate_events('deposit_create', transaction)
            update_plot_balance(vals[:land_parcel_id], vals[:amount])
            update_wallet_balance(user, transaction, vals[:amount]) if transaction.settled?
            { wallet_transaction: transaction }
          else
            raise GraphQL::ExecutionError, transaction.errors.full_messages&.join(', ')
          end
        end
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
