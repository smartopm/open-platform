# frozen_string_literal: true

# Manages amount allocated to Plan.
class PlanPayment < ApplicationRecord
  enum status: { paid: 0, cancelled: 1 }

  belongs_to :user_transaction, class_name: 'Transaction', foreign_key: :transaction_id,
                                inverse_of: :plan_payments
  belongs_to :user
  belongs_to :community
  belongs_to :payment_plan

  validates :amount, numericality: { greater_than: 0 }
end
