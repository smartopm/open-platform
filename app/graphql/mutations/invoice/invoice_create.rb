# frozen_string_literal: true

module Mutations
  module Invoice
    # Create a new Invoice
    class InvoiceCreate < BaseMutation
      argument :payment_plan_id, ID, required: true
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
        context[:payment_plan] = Properties::PaymentPlan.find_by(id: vals[:payment_plan_id])
        raise_plan_not_found_error
        invoice = context[:site_community].invoices.create(
          vals.merge(land_parcel_id: context[:payment_plan].land_parcel.id),
        )
        return { invoice: invoice.reload } if invoice.persisted?

        raise GraphQL::ExecutionError, invoice.errors.full_messages&.join(', ')
      end
      # rubocop:enable Metrics/AbcSize

      # Raises GraphQL execution error if payment plan does not exists.
      #
      # @return [GraphQL::ExecutionError]
      def raise_plan_not_found_error
        return if context[:payment_plan].present?

        raise GraphQL::ExecutionError, I18n.t('errors.payment_plan.not_found')
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
