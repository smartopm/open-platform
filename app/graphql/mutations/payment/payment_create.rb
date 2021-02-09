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

      field :payments, [Types::PaymentType], null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(vals)
        ActiveRecord::Base.transaction do
          user = context[:site_community].users.find(vals[:user_id])
          remaining_amount = vals[:amount]
          # This mutation needs tobe replaced with walletTransactionCreate : Saurabh
          user.wallet.settle_pending_balance(remaining_amount, vals[:payment_type], user.id)
          transaction = create_transaction(user, vals)
          user.invoices.where('pending_amount > ?', 0).reverse.each do |invoice|
            break unless remaining_amount.positive?

            remaining_amount = extract_payment(invoice, remaining_amount, user,
                                               vals[:payment_type], transaction.id)
          end
          payments = PaymentInvoice.where(wallet_transaction_id: transaction.id).map(&:payment)
          return { payments: payments } if transaction.persisted?
        end
        raise GraphQL::ExecutionError, transaction.errors.full_messages
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def extract_payment(inv, amount, user, payment_type, transaction_id)
        payment_amount = amount > inv.pending_amount ? inv.pending_amount : amount
        payment = create_payment(payment_amount, payment_type, user)
        inv.payment_invoices.create(payment_id: payment.id, wallet_transaction_id: transaction_id)
        inv.update(pending_amount: (inv.pending_amount - payment_amount))
        amount - payment_amount
      end

      def create_payment(payment_amount, payment_type, user)
        ::Payment.create(
          amount: payment_amount,
          payment_type: payment_type,
          user_id: user.id,
          community_id: user.community_id,
        )
      end

      # rubocop:disable Metrics/MethodLength
      def create_transaction(user, vals)
        payment_status = vals[:payment_type].eql?('cash') ? 'settled' : vals[:payment_status]
        user.wallet_transactions.create!({
                                           source: vals[:payment_type],
                                           destination: 'invoice',
                                           amount: vals[:amount],
                                           status: payment_status,
                                           user_id: vals[:user_id],
                                           bank_name: vals[:bank_name],
                                           cheque_number: vals[:cheque_number],
                                           current_wallet_balance: user.wallet.balance,
                                         })
      end
      # rubocop:enable Metrics/MethodLength

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
