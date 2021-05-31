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
  validates :manual_receipt_number, uniqueness: { allow_nil: true, scope: :community_id }

  has_paper_trail

  before_create :assign_current_plot_balance

  # Returns receipt number
  #
  # @return [String]
  def receipt_number
    manual_receipt_number.present? ? "MI#{manual_receipt_number}" : "SI#{automated_receipt_number}"
  end

  private

  # Assigns payment plan pending balance to payment entry.
  #
  # @return [void]
  # @note attribute +current_plot_pending_balance+ will used to track plot's pending balace.
  def assign_current_plot_balance
    self.current_plot_pending_balance = payment_plan.pending_balance
  end
end
