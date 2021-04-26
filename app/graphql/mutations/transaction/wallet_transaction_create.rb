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
      #
      # @param vals [Hash]
      #
      # @return [Hash] WalletTransaction
      def resolve(vals)
        ActiveRecord::Base.transaction do
          user = context[:site_community].users.find_by(id: vals[:user_id])
          land_parcel = context[:site_community].land_parcels.find_by(id: vals[:land_parcel_id])
          context[:payment_plan] = land_parcel.payment_plan
          context[:wallet] = user.wallet

          raise_plan_required_error
          transaction_attributes = vals.except(:land_parcel_id)
                                       .merge(
                                         destination: 'wallet',
                                         status: 'settled',
                                         community_id: context[:site_community]&.id,
                                         depositor_id: context[:current_user].id,
                                         originally_created_at: user.current_time_in_timezone,
                                         payment_plan_id: context[:payment_plan].id,
                                       )

          context[:transaction] = WalletTransaction.create!(transaction_attributes)
          execute_transaction_callbacks(vals.slice(:source, :amount))
          { wallet_transaction: context[:transaction].reload }
        end
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end

      private

      # Raises GraphQL execution error if payment plan does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_plan_required_error
        return if context[:payment_plan].present?

        raise GraphQL::ExecutionError, 'Payment Plan does not exist for selected property'
      end

      # rubocop:disable Metrics/AbcSize
      # Performs actions post wallet transaction creation.
      # * Generates event log for tag deposit create.
      # * Updates plot balance.
      # * Updates current_wallet_balance of WalletTransaction
      # * Updates wallet balance of user
      # * Settles pending invoices of user.
      #
      # @param [Hash] args
      # @option args [Float] amount
      # @option args [String] source type
      #
      # @return [void]
      def execute_transaction_callbacks(args)
        transaction = context[:transaction]
        context[:current_user].generate_events('deposit_create', transaction)
        if args[:source] != 'unallocated_funds'
          context[:payment_plan].update_plot_balance(args[:amount])
          update_wallet_balance(args[:amount])
        else
          raise_funds_not_sufficient_error(args)
        end
        context[:wallet].settle_invoices(args.merge(transaction: transaction))
      end
      # rubocop:enable Metrics/AbcSize

      # Raises GraphQL execution error if unallocated_funds is less than payment amount.
      #
      # @param source [String]
      # @param amount [Float]
      #
      # @return [GraphQL::ExecutionError]
      def raise_funds_not_sufficient_error(args)
        return if context[:wallet].unallocated_funds >= args[:amount]

        raise GraphQL::ExecutionError,
              'Unallocated funds are not sufficient for the payment'
      end

      # Updates wallet and WalletTransaction balance,
      # * WalletTransaction#current_wallet_balance
      # * Wallet#balance
      #
      # @param amount [Float]
      #
      # @return [void]
      def update_wallet_balance(amount)
        return unless context[:transaction].settled?

        context[:transaction].update(
          current_wallet_balance: context[:wallet].balance + amount,
        )
        context[:wallet].update_balance(amount)
      end
    end
  end
end
