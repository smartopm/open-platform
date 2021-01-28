# frozen_string_literal: true

# Stores user wallet balance and pending balance
class Wallet < ApplicationRecord
  belongs_to :user

  DEFAULT_CURRENCY = 'ZMW'

  before_create do
    self.currency = DEFAULT_CURRENCY if currency.nil?
  end

  def settle_pending_balance(amount)
    if amount > pending_balance
      update(pending_balance: 0, balance: amount - pending_balance)
    else
      update(pending_balance: pending_balance - amount)
    end
  end

  def update_balance(amount, type = 'credit')
    return credit_amount(amount) if type.eql?('credit')

    debit_amount(amount)
  end

  def credit_amount(amount)
    settle_pending_balance(amount)
    if balance.positive?
      user.invoices.where('pending_amount > ?', 0).find_each { |inv| make_payment(inv) }
    end

    balance
  end

  def debit_amount(amount)
    if balance > amount
      update(balance: (balance - amount))
    else
      update(balance: 0, pending_balance: (pending_balance + amount - balance))
    end
    balance
  end

  def make_payment(inv)
    transaction = create_transaction(inv)
    payment = Payment.create(payment_type: 'wallet', amount: inv.pending_amount)
    inv.payment_invoices.create(payment_id: payment.id, wallet_transaction_id: transaction.id)
    inv.update(pending_amount: 0, status: 'paid')
  end

  def create_transaction(inv)
    user.wallet_transactions.create!({
                                       source: 'wallet',
                                       destination: 'invoice',
                                       amount: inv.pending_amount,
                                       status: 'settled',
                                       user_id: user.id,
                                     })
  end
end
