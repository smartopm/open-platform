# frozen_string_literal: true

# Stores user wallet balance and pending balance
class Wallet < ApplicationRecord
  belongs_to :user

  DEFAULT_CURRENCY = 'ZMW'

  before_create do
    self.currency = DEFAULT_CURRENCY if currency.nil?
  end

  after_update :settle_invoices, if: proc { saved_changes.key?('balance') }

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
  def make_payment(inv, payment_amount)
    transaction = create_transaction(payment_amount)
    payment = Payment.create(amount: payment_amount, payment_type: 'wallet',
                             user_id: user.id, community_id: user.community_id,
                             payment_status: 'settled')
    payment.payment_invoices.create(invoice_id: inv.id, wallet_transaction_id: transaction.id)
    inv.update(pending_amount: inv.pending_amount - payment_amount)
    inv.paid! if inv.pending_amount.zero?
  end

  # rubocop:disable Style/OptionalBooleanParameter
  def settle_from_plot_balance(inv, payment_amount, prepaid = false)
    update_balance(payment_amount, 'debit') unless prepaid
    plan = inv.land_parcel.payment_plan
    plan.update(
      plot_balance: plan.plot_balance - payment_amount,
      pending_balance: plan.pending_balance - payment_amount,
    )
    make_payment(inv, payment_amount)
  end
  # rubocop:enable Style/OptionalBooleanParameter

  def settle_invoices
    return if (saved_changes['balance'].last - saved_changes['balance'].first).negative?

    user.invoices.not_cancelled.where('pending_amount > ?', 0).reverse.each do |invoice|
      next if invoice.land_parcel.payment_plan&.plot_balance.to_i.zero?

      bal = invoice.land_parcel.payment_plan&.plot_balance
      payment_amount = invoice.pending_amount > bal ? bal : invoice.pending_amount
      settle_from_plot_balance(invoice, payment_amount)
    end
  end
  # rubocop:enable Metrics/AbcSize

  def create_transaction(payment_amount)
    user.wallet_transactions.create!({
                                       source: 'wallet',
                                       destination: 'invoice',
                                       amount: payment_amount,
                                       status: 'settled',
                                       user_id: user.id,
                                       current_wallet_balance: balance,
                                       community_id: user.community_id,
                                     })
  end
end
