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

      # rubocop:disable Metrics/AbcSize
      # Graphql Resolver to create new Invoice.
      # Creates Invoice otherwise, raises GraphQL::ExecutionError with validation error message.
      def resolve(vals)
        vals = vals.merge(created_by: context[:current_user])
        land_parcel = context[:site_community].land_parcels.find(vals[:land_parcel_id])
        invoice = context[:site_community].invoices.create(
          vals.merge(payment_plan: land_parcel.payment_plan),
        )
        return { invoice: invoice.reload } if invoice.persisted?

        raise GraphQL::ExecutionError, invoice.errors.full_messages&.join(', ')
      end
      # rubocop:enable Metrics/AbcSize

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
