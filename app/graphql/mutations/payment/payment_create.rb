# frozen_string_literal: true

module Mutations
  module Payment
    # Create a new Payment
    class PaymentCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :amount, Float, required: true
      argument :payment_type, String, required: true
      argument :bank_name, String, required: false
      argument :cheque_number, String, required: false
      argument :payment_status, String, required: false

      field :wallet_transaction, Types::WalletTransactionType, null: true

      def resolve(vals)
        ActiveRecord::Base.transaction do
          user = context[:site_community].users.find(vals[:user_id])
          transaction = create_transaction(user, vals)
          user.invoices.where('pending_amount > ?', 0).each do |inv|
            debugger
          end
          return { wallet_transaction: transaction } if transaction.persisted?
        end
        raise GraphQL::ExecutionError, transaction.errors.full_messages
      end

      def create_transaction(user, vals) uske baad 
        payment_status = vals[:payment_type].eql?('cash') ? 'settled' : vals[:payment_status]
        user.wallet_transactions.create!({
          source: vals[:payment_type],
          destination: 'invoice',
          amount: vals[:amount],
          status: payment_status,
          user_id: vals[:user_id],
          bank_name: vals[:bank_name],
          cheque_number: vals[:cheque_number],
        })
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
