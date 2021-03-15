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

        ActiveRecord::Base.transaction do
          invoice.cancelled!
          refund_amount(invoice)
        end
        { invoice: invoice.reload }
      end

      def refund_amount(invoice)
        user = invoice.user
        user.wallet.settle_pending_balance(invoice.amount)
        user.wallet_transactions.create!(
          source: 'invoice',
          destination: 'wallet',
          amount: invoice.amount,
          status: 'settled',
          current_wallet_balance: user.wallet.balance,
          community_id: invoice.community_id,
        )
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
