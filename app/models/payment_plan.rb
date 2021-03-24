# frozen_string_literal: true

# PaymentPlan
class PaymentPlan < ApplicationRecord
  belongs_to :user
  belongs_to :land_parcel
  has_many :invoices, dependent: :nullify

  enum status: { active: 0, cancelled: 1, deleted: 2 }

  def update_plot_balance(amount, type = 'credit')
    return if amount.zero?

    balance = type.eql?('credit') ? (plot_balance + amount) : (plot_balance - amount)
    update(plot_balance: balance)
  end
end
