# frozen_string_literal: true

# Stores user wallet balance and pending balance
class Wallet < ApplicationRecord
  belongs_to :user

  DEFAULT_CURRENCY = 'ZMW'

  before_create do
    self.currency = DEFAULT_CURRENCY if currency.nil?
  end

  after_update :settle_invoices, if: proc { saved_changes.key?('balance') }

  def settle_pending_balance(amount)
    if amount > pending_balance
      credited_amount = amount - pending_balance
      update(pending_balance: 0, balance: balance + credited_amount)
    else
      update(pending_balance: pending_balance - amount)
    end
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
      update(balance: (balance - amount), pending_balance: (pending_balance - amount))
    else
      update(balance: 0, pending_balance: pending_balance + amount - balance)
    end
    balance
  end

  # rubocop:disable Metrics/AbcSize
  def make_payment(inv)
    payment_amount = inv.pending_amount > balance ? balance : inv.pending_amount
    update_balance(payment_amount, 'debit')
    transaction = create_transaction(payment_amount)
    payment = Payment.create(amount: payment_amount, payment_type: 'wallet',
                             user_id: user.id, community_id: user.community_id)
    payment.payment_invoices.create(invoice_id: inv.id, wallet_transaction_id: transaction.id)
    inv.update(pending_amount: inv.pending_amount - payment_amount)
  end

  def settle_invoices
    return if (saved_changes['balance'].last - saved_changes['balance'].first).negative?

    user.invoices.where('pending_amount > ?', 0).reverse.each do |invoice|
      break unless balance.positive?

      make_payment(invoice)
      invoice.paid! if invoice.pending_amount.zero?
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
                                       depositor_id: user.id,
                                     })
  end
end
