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
          user = context[:site_community].users.find_by(id: vals[:user_id])
          land_parcel = context[:site_community].land_parcels.find_by(id: vals[:land_parcel_id])
          raise_plan_required_error if land_parcel.payment_plan.nil?
          transaction = user.wallet_transactions.create!(
            vals.except(:user_id, :land_parcel_id)
                .merge({
                         destination: 'wallet',
                         status: 'settled',
                         community_id: context[:site_community]&.id,
                         depositor_id: context[:current_user].id,
                         originally_created_at: user.current_time_in_timezone,
                         payment_plan_id: land_parcel.payment_plan&.id,
                       }),
          )
          context[:current_user].generate_events('deposit_create', transaction)
          land_parcel.payment_plan&.update_plot_balance(vals[:amount])
          if transaction.settled?
            update_wallet_balance(user, transaction, vals[:amount])
            user.wallet.settle_invoices(transaction.id)
          end
          { wallet_transaction: transaction.reload }
        end
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def update_wallet_balance(user, transaction, amount)
        transaction.update(current_wallet_balance: user.wallet.balance + amount)
        user.wallet.update_balance(amount)
      end

      def raise_plan_required_error
        raise GraphQL::ExecutionError, 'Payment Plan does not exist for selected property'
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
