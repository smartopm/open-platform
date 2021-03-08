# frozen_string_literal: true

module Mutations
  module Invoice
    # Cancel a pending Invoice
    class InvoiceCancel < BaseMutation
      argument :invoice_id, ID, required: true

      field :invoice, Types::InvoiceType, null: true

      def resolve(invoice_id:)
        invoice = context[:site_community].invoices.find_by(id: invoice_id)
        if invoice.nil? || invoice.cancelled?
          raise GraphQL::ExecutionError, 'Invoice can not be cancelled'
        end

        return { invoice: invoice.reload } if settle_transaction(invoice)

        raise GraphQL::ExecutionError, invoice.errors.full_messages
      end

      # rubocop:disable Metrics/MethodLength
      def settle_transaction(invoice)
        ActiveRecord::Base.transaction do
          invoice.cancelled!
          user = invoice.reload.user
          amount = sum_payment_amount(invoice)
          user.wallet.settle_pending_balance(amount)
          balance = user.wallet.balance
          user.wallet_transactions.create(
            source: 'wallet',
            destination: 'invoice',
            amount: invoice.amount,
            status: 'cancelled',
            current_wallet_balance: balance,
            community_id: context[:site_community]
                          .id,
          )
        end
      end
      # rubocop:enable Metrics/MethodLength

      def sum_payment_amount(invoice)
        return invoice.amount if invoice.payments.empty?

        payment_amount = invoice.payments.sum(&:amount)
        invoice.amount - payment_amount
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
