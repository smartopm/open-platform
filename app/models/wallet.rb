# frozen_string_literal: true

# Stores user wallet balance and pending balance
class Wallet < ApplicationRecord
  belongs_to :user

  DEFAULT_CURRENCY = 'ZMW'

  before_create do
    self.currency = DEFAULT_CURRENCY if currency.nil?
  end

  def update_balance(amount, type = 'credit')
    return credit_amount(amount) if type.eql?('credit')

    debit_amount(amount)
  end

  def credit_amount(amount)
    update(balance: balance + amount)

    balance
  end

  def debit_amount(amount)
    if balance >= amount
      pending_bal = amount >= pending_balance ? 0 : pending_balance - amount
      update(balance: (balance - amount), pending_balance: pending_bal)
    else
      update(balance: 0, pending_balance: pending_balance + amount - balance)
    end
    balance
  end

  # rubocop:disable Metrics/AbcSize
  def make_payment(inv, payment_amount, user_transaction_id = nil)
    invoice_transaction_id = create_transaction(payment_amount, inv)&.id
    transaction_id = user_transaction_id || invoice_transaction_id

    payment = Payment.create(amount: payment_amount, payment_type: 'wallet',
                             user_id: user.id, community_id: user.community_id,
                             payment_status: 'settled')
    payment.payment_invoices.create(invoice_id: inv.id, wallet_transaction_id: transaction_id)
    inv.update(pending_amount: inv.pending_amount - payment_amount)
    inv.paid! if inv.pending_amount.zero?
  end

  # rubocop:disable Style/OptionalBooleanParameter
  def settle_from_plot_balance(inv, payment_amount, user_transaction_id = nil, prepaid = true)
    update_balance(payment_amount, 'debit') unless prepaid
    plan = inv.land_parcel.payment_plan
    plan.update(
      plot_balance: plan.plot_balance - payment_amount,
      pending_balance: plan.pending_balance - payment_amount,
    )
    make_payment(inv, payment_amount, user_transaction_id)
  end
  # rubocop:enable Style/OptionalBooleanParameter

  # rubocop:disable Metrics/MethodLength
  def settle_invoices(user_transaction_id)
    settled_invoices = []
    user.invoices.not_cancelled.where('pending_amount > ?', 0).reverse.each do |invoice|
      next if invoice.land_parcel.payment_plan&.plot_balance.to_i.zero?

      bal = invoice.land_parcel.payment_plan&.plot_balance
      payment_amount = invoice.pending_amount > bal ? bal : invoice.pending_amount
      settled_invoices << invoice_object(invoice, payment_amount)
      settle_from_plot_balance(invoice, payment_amount, user_transaction_id, false)
    end

    transaction = WalletTransaction.find(user_transaction_id)
    transaction.settled_invoices = settled_invoices
    transaction.current_pending_plot_balance = transaction.payment_plan.pending_balance
    transaction.save!
  end
  # rubocop:enable Metrics/MethodLength

  # rubocop:enable Metrics/AbcSize

  def create_transaction(payment_amount, inv)
    user.wallet_transactions.create!({
                                       source: 'wallet',
                                       destination: 'invoice',
                                       amount: payment_amount,
                                       status: 'settled',
                                       user_id: user.id,
                                       current_wallet_balance: balance,
                                       community_id: user.community_id,
                                       payment_plan: inv.payment_plan,
                                     })
  end

  private

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
end
