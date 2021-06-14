# frozen_string_literal: true

module Payments
  # Manages amount allocated to Plan.
  class PlanPayment < ApplicationRecord
    include SearchCop

    enum status: { paid: 0, cancelled: 1 }

    belongs_to :user_transaction, class_name: 'Payments::Transaction', foreign_key: :transaction_id,
                                  inverse_of: :plan_payments
    belongs_to :user, class_name: 'Users::User'
    belongs_to :community
    belongs_to :payment_plan, class_name: 'Properties::PaymentPlan'

    validates :amount, numericality: { greater_than: 0 }
    validates :manual_receipt_number, uniqueness: { allow_nil: true, scope: :community_id }

    has_paper_trail

    search_scope :search do
      attributes :created_at, :automated_receipt_number, :manual_receipt_number
      attributes user: ['user.name']
      attributes phone_number: ['user.phone_number']
      attributes email: ['user.email']
      attributes amount: ['user_transaction.amount']
      attributes source: ['user_transaction.source']
    end

    scope :created_at_lteq, lambda { |created_at|
      where(PlanPayment.arel_table[:created_at].lteq(created_at))
    }

    # rubocop:disable Layout/LineLength
    # Returns receipt number
    #
    # @return [String]
    def receipt_number
      manual_receipt_number.present? ? "MI#{manual_receipt_number}" : "SI#{automated_receipt_number}"
    end
    # rubocop:enable Layout/LineLength
  end
end
