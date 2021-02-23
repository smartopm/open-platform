# frozen_string_literal: true

module Mutations
  module Invoice
    # Cancel a pending Invoice
    class InvoiceCancel < BaseMutation
      argument :invoice_id, ID, required: true

      field :invoice_cancel, Types::InvoiceType, null: true

      def resolve(vals)
        invoice = context[:site_community].invoices
        raise GraphQL::ExecutionError, 'Invoice can not be cancelled' if invoice.paid?

        invoice.cancelled!

        raise GraphQL::ExecutionError, invoice.errors.full_messages
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
