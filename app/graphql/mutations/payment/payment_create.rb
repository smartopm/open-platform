# frozen_string_literal: true

module Mutations
  module Payment
    # Create a new Payment
    class PaymentCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :invoice_id, ID, required: true
      argument :amount, String, required: true
      argument :payment_type, String, required: true

      field :payment, Types::PaymentType, null: true

      def resolve(vals)
        user = context[:site_community].users.find(vals[:user_id])
        payment = user.payments.create(vals.except(:user_id))
        payment.payment_status = 0 if vals[:payment_type] == "cash"
        return { payment: payment } if payment.persisted?

        raise GraphQL::ExecutionError, payment.errors.full_messages
      end

      def authorized?(_vals)
        return true if context[:current_user]

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
