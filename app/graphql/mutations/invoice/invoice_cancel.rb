# frozen_string_literal: true

module Mutations
  module Invoice
    # Cancel a pending Invoice
    class InvoiceCancel < BaseMutation
      argument :invoice_id, ID, required: true

      field :invoice, Types::InvoiceType, null: true

      # rubocop:disable Metrics/AbcSize
      # Cancels invoice and refund amount to plot and wallet balance.
      #
      # @param invoice_id [String]
      #
      # @return [void]
      def resolve(invoice_id:)
        context[:invoice] = context[:site_community].invoices.find_by(id: invoice_id)
        context[:user] = context[:invoice].user
        context[:wallet] = context[:user].wallet

        raise_invoice_can_not_cancelled
        ActiveRecord::Base.transaction do
          context[:invoice].cancelled!
          context[:invoice].payments.update(payment_status: 'cancelled')
          refund_amount
        end
        { invoice: context[:invoice].reload }
      end
      # rubocop:enable Metrics/AbcSize

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end

      private

      # Raises GraphQL execution error if Invoice is can not be cancelled.
      #
      # @return [GraphQL::ExecutionError]
      def raise_invoice_can_not_cancelled
        return unless context[:invoice].nil? || context[:invoice].cancelled?

        raise GraphQL::ExecutionError, 'Invoice can not be cancelled'
      end

      # Refunds invoice amount to plot balance.
      #
      # @return [void]
      def refund_amount
        update_plot_balance
        settle_pending_balance
        create_refund_transaction
        context[:wallet].transfer_remaining_funds_to_unallocated
      end

      # Updates plot balance and pending balance of payment plan.
      #
      # @return [void]
      def update_plot_balance
        invoice = context[:invoice]
        plan = invoice.land_parcel.payment_plan

        plan.update(
          plot_balance: plan.plot_balance + (invoice.amount - invoice.pending_amount),
          pending_balance: plan.pending_balance - invoice.pending_amount,
        )
      end

      # Updates wallet balance with refund amount.
      #
      # @return [void]
      def settle_pending_balance
        wallet = context[:wallet]
        amount = context[:invoice].amount
        pending_balance = wallet.pending_balance

        if amount >= pending_balance
          credited_amount = wallet.balance + amount
          wallet.update(pending_balance: 0, balance: credited_amount - pending_balance)
        else
          wallet.update(pending_balance: pending_balance - amount)
        end
      end

      # Creates transaction log(WalletTransaction) for refund amount.
      #
      # @return [void]
      def create_refund_transaction
        context[:user].wallet_transactions.create!(
          source: 'invoice',
          destination: 'wallet',
          amount: context[:invoice].amount,
          status: 'settled',
          current_wallet_balance: context[:user].wallet.balance,
          community_id: context[:invoice].community_id,
          payment_plan: context[:invoice].payment_plan,
        )
      end
    end
  end
end
