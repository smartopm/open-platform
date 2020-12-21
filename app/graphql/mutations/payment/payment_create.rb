# frozen_string_literal: true

module Mutations
  module Payment
    # Create a new Payment
    class PaymentCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :invoice_id, ID, required: true
      argument :amount, Float, required: true
      argument :payment_type, String, required: true

      field :payment, Types::PaymentType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        user = context[:site_community].users.find(vals[:user_id])
        payment = user.payments.create(vals.except(:user_id))
        payment.settled! if vals[:payment_type] == 'cash'
        payment_status_update(vals[:invoice_id], vals[:amount])
        return { payment: payment } if payment.persisted?

        raise GraphQL::ExecutionError, payment.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize

      def payment_status_update(invoice_id, amount)
        inv = context[:site_community].invoices.find(invoice_id)
        inv.paid! if inv.amount == amount
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
