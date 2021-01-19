# frozen_string_literal: true

module Mutations
  module Payment
    # Create a new Payment
    class PaymentCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :invoice_id, ID, required: true
      argument :amount, Float, required: true
      argument :payment_type, String, required: true
      argument :bank_name, String, required: false
      argument :cheque_number, String, required: false
      argument :payment_status, String, required: false

      field :payment, Types::PaymentType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        if vals[:amount] > find_invoice(vals[:invoice_id]).amount ||
           vals[:amount] > rem_amount(find_invoice(vals[:invoice_id]))
          raise GraphQL::ExecutionError,
                'The amount you are trying to pay is higher than the invoiced amount'
        end
        ActiveRecord::Base.transaction do
          user = context[:site_community].users.find(vals[:user_id])
          payment = user.payments.create(vals.except(:user_id))
          invoice_update(vals[:invoice_id], vals[:amount])
          payment.settled! if vals[:payment_type] == 'cash'
          return { payment: payment } if payment.persisted?
        end
        raise GraphQL::ExecutionError, payment.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def invoice_update(invoice_id, amount)
        inv = context[:site_community].invoices.find(invoice_id)
        inv.paid! if verify_amount(invoice_id, amount)
      end

      def verify_amount(invoice_id, amount)
        inv = context[:site_community].invoices.find(invoice_id)
        amount == inv.amount || inv.amount == total_payment(inv)
      end

      def total_payment(inv)
        inv.payments.sum(&:amount)
      end

      def rem_amount(inv)
        inv.amount - total_payment(inv)
      end

      def find_invoice(invoice_id)
        context[:site_community].invoices.find(invoice_id)
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
