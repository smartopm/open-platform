# frozen_string_literal: true

module Mutations
  module Invoice
    # Cancel a pending Invoice
    class InvoiceCancel < BaseMutation
      argument :invoice_id, ID, required: true

      field :invoice, Types::InvoiceType, null: true

      def resolve(invoice_id:)
        invoice = context[:site_community].invoices.find_by(id: invoice_id)
        if invoice.nil? || invoice.cancelled?
          raise GraphQL::ExecutionError, 'Invoice can not be cancelled'
        end

        ActiveRecord::Base.transaction do
          invoice.cancelled!
          invoice.payments.update(payment_status: 'cancelled')
          refund_amount(invoice)
        end
        { invoice: invoice.reload }
      end

      # rubocop:disable Metrics/AbcSize
      def refund_amount(invoice)
        user = invoice.user
        paid_amount = invoice.amount - invoice.pending_amount
        plan = invoice.land_parcel.payment_plan
        plan.update(
          plot_balance: plan.plot_balance + paid_amount,
          pending_balance: plan.pending_balance - invoice.pending_amount,
        )
        settle_pending_balance(user.wallet, invoice.amount)
        create_refund_transaction(user, invoice)
        settle_other_invoices(invoice.user)
      end
      # rubocop:enable Metrics/AbcSize

      def create_refund_transaction(user, invoice)
        user.wallet_transactions.create!(
          source: 'invoice',
          destination: 'wallet',
          amount: invoice.amount,
          status: 'settled',
          current_wallet_balance: user.wallet.balance,
          community_id: invoice.community_id,
          payment_plan: invoice.payment_plan,
        )
      end

      # rubocop:disable Rails/SkipsModelValidations
      def settle_pending_balance(wallet, amount)
        if amount > wallet.pending_balance
          credited_amount = amount - wallet.pending_balance
          wallet.update_columns(pending_balance: 0, balance: wallet.balance + credited_amount)
        else
          wallet.update_columns(pending_balance: wallet.pending_balance - amount)
        end
      end
      # rubocop:enable Rails/SkipsModelValidations

      # rubocop:disable Metrics/AbcSize
      def settle_other_invoices(user)
        user.invoices.not_cancelled.where('pending_amount > ?', 0).reverse.each do |invoice|
          next if invoice.land_parcel.payment_plan&.plot_balance.to_i.zero?

          bal = invoice.land_parcel.payment_plan&.plot_balance
          payment_amount = invoice.pending_amount > bal ? bal : invoice.pending_amount
          user.wallet.settle_from_plot_balance(invoice, payment_amount, true)
        end
      end
      # rubocop:enable Metrics/AbcSize

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
