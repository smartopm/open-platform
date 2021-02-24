# frozen_string_literal: true

module Mutations
  module Invoice
    # Cancel a pending Invoice
    class InvoiceCancel < BaseMutation
      argument :invoice_id, ID, required: true

      field :invoice, Types::InvoiceType, null: true

      def resolve(invoice_id:)
        invoice = context[:site_community].invoices.find_by(id: invoice_id)
        if invoice.paid? || invoice.nil? || invoice.cancelled?
          raise GraphQL::ExecutionError, 'Invoice can not be cancelled'
        end

        return { invoice: invoice.reload } if invoice.cancelled!

        raise GraphQL::ExecutionError, invoice.errors.full_messages
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
