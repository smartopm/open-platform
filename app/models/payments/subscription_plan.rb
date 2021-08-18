# frozen_string_literal: true

module Payments
  # Manages community subscription plans
  class SubscriptionPlan < ApplicationRecord
    belongs_to :community

    enum status: { active: 0, in_active: 1 }, _prefix: true
    enum plan_type: { starter: 0, basic: 1, standard: 2, premium: 3 }, _prefix: true

    validates :amount, numericality: { greater_than: 0 }
    validates :start_date, :end_date, :plan_type, presence: true
    validate :ensure_valid_dates

    private

    def ensure_valid_dates
      return if start_date.nil? || end_date.nil?

      errors.add(:end_date, :invalid_dates) if end_date <= start_date
    end
  end
end
