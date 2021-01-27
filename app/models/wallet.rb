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
    if pending_balance > amount
      update(pending_balance: (pending_balance - amount))
    else
      update(balance: (balance + amount - pending_balance), pending_balance: 0)
      # TODO: We should also check the status before creating payments, ignoring now
      # not sure which statuses to include: Saurabh
      user.invoices.where('pending_amount > ?', 0).find_each { |inv| make_payment(inv) }
    end
    balance
  end

  def debit_amount(amount)
    if balance > amount
      update(balance: (balance - amount))
    else
      pending_balance = amount - balance
      update(balance: 0, pending_balance: pending_balance)
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
