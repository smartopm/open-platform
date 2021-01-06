# frozen_string_literal: true

module Mutations
  module Invoice
    # Create a new Invoice
    class InvoiceCreate < BaseMutation
      argument :land_parcel_id, ID, required: true
      argument :description, String, required: false
      argument :note, String, required: false
      argument :amount, Float, required: true
      argument :due_date, String, required: true
      argument :status, String, required: true
      argument :user_id, ID, required: true

      field :invoice, Types::InvoiceType, null: true

      def resolve(vals)
        vals = vals.merge(created_by: context[:current_user])
        invoice = context[:site_community].invoices.create(vals)
        return { invoice: invoice } if invoice.persisted?

        raise GraphQL::ExecutionError, invoice.errors.full_messages
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
