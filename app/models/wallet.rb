# frozen_string_literal: true

# Stores user wallet balance and pending balance
class Wallet < ApplicationRecord
  belongs_to :user

  DEFAULT_CURRENCY = 'ZMW'

  before_create do
    self.currency = DEFAULT_CURRENCY if currency.nil?
  end

  def update_balance(amount)
    if pending_balance > amount
      update(pending_balance: (pending_balance - amount))
    else
      update(balance: (balance + amount - pending_balance), pending_balance: 0)
    end
    balance
  end
end
