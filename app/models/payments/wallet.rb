# frozen_string_literal: true

module Payments
  # Manages wallet balance of user.
  # rubocop:disable Metrics/ClassLength
  class Wallet < ApplicationRecord
    belongs_to :user, class_name: 'Users::User'

    DEFAULT_CURRENCY = 'ZMW'

    before_create do
      self.currency = DEFAULT_CURRENCY if currency.nil?
    end

    # Settles invoices of user using plot balance or unallocated funds
    #
    # @param args [Hash]
    # @option args [String] source
    # @option args [Float] amount
    # @option args [WalletTransaction] transaction
    #
    # @return [void]
    def settle_invoices(args = {})
      transaction = args[:transaction]
      return if transaction.blank?

      if args[:source] == 'unallocated_funds'
        settle_invoices_with_unallocated_funds(args)
      else
        settle_invoices_with_plot_balance(transaction)
      end
      transfer_remaining_funds_to_unallocated
    end

    # Updates wallet balance (Debit/Credit).
    #
    # @param amount [Float]
    # @param type [String] action credit/debited
    #
    # @return [Float] wallet's amount.
    def update_balance(amount, type = 'credit')
      if type.eql?('credit')
        credit_amount(amount)
      else
        debit_amount(amount)
      end
      balance
    end

    # Creates WalletTransaction for given invoice.
    #
    # @param payment_amount [Float]
    # @param inv [Invoice]
    #
    # @return [void]
    # rubocop:disable Metrics/MethodLength
    def create_transaction(payment_amount, inv, created_at = Time.zone.now)
      user.wallet_transactions.create!({
                                         source: 'wallet',
                                         destination: 'invoice',
                                         amount: payment_amount,
                                         status: 'settled',
                                         user_id: user.id,
                                         current_wallet_balance: balance,
                                         community_id: user.community_id,
                                         payment_plan: inv.payment_plan,
                                         created_at: created_at,
                                       })
    end

    # rubocop:enable Metrics/MethodLength
    # Transfer remaining plot balance to Wallet's unallocated funds.
    # * Updates payment plan's plot_balance to zero.
    # * Adds remaining plot balance to Wallet#unallocated_funds.
    #
    # @return [void]
    def transfer_remaining_funds_to_unallocated
      payment_plans = user.payment_plans.where.not(plot_balance: 0)

      payment_plans.each do |payment_plan|
        update(unallocated_funds: unallocated_funds + payment_plan.plot_balance)
        payment_plan.update(plot_balance: 0)
      end
    end

    # Deducts unallocated funds from wallet.
    #
    # @param payment_amount [Float]
    #
    # @return [void]
    def debit_unallocated_funds(payment_amount)
      if unallocated_funds > payment_amount
        update(unallocated_funds: unallocated_funds - payment_amount)
      else
        update(unallocated_funds: 0)
      end
    end

    private

    # Deposits amount in wallet balance.
    #
    # @param amount [Float]
    #
    # @return [Float] wallet's amount.
    def credit_amount(amount)
      update(balance: balance + amount)
    end

    # Deducts amount from wallet balance.
    #
    # @param amount [Float]
    #
    # @return [Float] wallet's amount.
    def debit_amount(amount)
      if balance >= amount
        pending_bal = amount >= pending_balance ? 0 : pending_balance - amount
        update(balance: (balance - amount), pending_balance: pending_bal)
      else
        update(balance: 0, pending_balance: pending_balance + amount - balance)
      end
    end

    # Settles invoices using wallet unallocated funds.
    #
    # @param args [Hash]
    # @option args [Float] amount
    # @option args [WalletTransaction] WalletTransaction
    #
    # @return [void]
    # rubocop:disable Metrics/AbcSize
    # rubocop:disable Metrics/MethodLength
    def settle_invoices_with_unallocated_funds(args)
      amount = args[:amount]
      transaction = args[:transaction]
      settled_invoices = []
      return if amount > unallocated_funds

      pending_invoices.each do |invoice|
        break if amount.zero?

        payment_amount = invoice.pending_amount > amount ? amount : invoice.pending_amount
        settled_invoices << invoice_object(invoice, payment_amount)
        amount -= payment_amount
        settle_from_unallocated_funds(invoice, payment_amount, transaction)
      end
      transaction.settled_invoices = settled_invoices
      transaction.current_pending_plot_balance = transaction.payment_plan.pending_balance
      transaction.save!
    end
    # rubocop:enable Metrics/AbcSize

    # Settles invoice using unallocated funds.
    #
    # @param inv [Invoice]
    # @param payment_amount [Float]
    # @param transaction [WalletTransaction]
    #
    # @return [void]
    def settle_from_unallocated_funds(inv, payment_amount, transaction)
      update_balance(payment_amount, 'debit')
      debit_unallocated_funds(payment_amount)
      plan = inv.payment_plan
      plan.update(pending_balance: plan.pending_balance - payment_amount)
      make_payment(inv, payment_amount, transaction)
    end

    # Settles pending invoices using available plot balance.
    #
    # @param transaction [WalletTransaction]
    #
    # @return [void]
    # rubocop:disable Metrics/AbcSize
    def settle_invoices_with_plot_balance(transaction)
      settled_invoices = []
      pending_invoices.each do |invoice|
        balance = invoice.payment_plan&.plot_balance
        next if balance.to_f.zero?

        payment_amount = invoice.pending_amount > balance ? balance : invoice.pending_amount
        settled_invoices << invoice_object(invoice, payment_amount)
        settle_from_plot_balance(invoice, payment_amount, transaction)
      end
      transaction.settled_invoices = settled_invoices
      transaction.current_pending_plot_balance = transaction.payment_plan.pending_balance
      transaction.save!
    end
    # rubocop:enable Metrics/AbcSize
    # rubocop:enable Metrics/MethodLength

    # Returns pending invoices of user,
    # * not cancelled
    # * pending amount greater than zero
    #
    # @return [Array<Invoice>]
    def pending_invoices
      user.invoices.not_cancelled.pending_amount_gt_than(0).reverse
    end

    def invoice_object(invoice, payment_amount)
      {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        due_date: invoice.due_date,
        amount_owed: invoice.pending_amount,
        amount_paid: payment_amount,
        amount_remaining: (invoice.pending_amount - payment_amount),
      }
    end

    # Settles invoice using associated plot balance.
    #
    # @param inv [Invoice]
    # @param payment_amount [Float]
    # @param transaction [WalletTransaction]
    #
    # @return [void]
    #
    def settle_from_plot_balance(inv, payment_amount, transaction)
      update_balance(payment_amount, 'debit')
      plan = inv.payment_plan
      plan.update(
        plot_balance: plan.plot_balance - payment_amount,
        pending_balance: plan.pending_balance - payment_amount,
      )
      make_payment(inv, payment_amount, transaction)
    end

    # Creates payment log(WalletTransaction/Payment) for respective invoice.
    #
    # @param inv [Invoice]
    # @param payment_amount [Float]
    # @param transaction [WalletTransaction]
    #
    # @return [void]
    # rubocop:disable Metrics/AbcSize
    def make_payment(inv, payment_amount, transaction)
      create_transaction(payment_amount, inv, transaction.created_at)
      payment = Payment.create(amount: payment_amount, payment_type: 'wallet',
                               user_id: user.id, community_id: user.community_id,
                               payment_status: 'settled', created_at: transaction.created_at)
      payment.payment_invoices.create(invoice_id: inv.id, wallet_transaction_id: transaction.id)
      inv.update(pending_amount: inv.pending_amount - payment_amount)
      inv.paid! if inv.pending_amount.zero?
    end
    # rubocop:enable Metrics/AbcSize
  end
end
# rubocop:enable Metrics/ClassLength
