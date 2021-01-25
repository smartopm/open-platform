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
end
