# frozen_string_literal: true

# Valuation, describe valuations on land parcels
class Valuation < ApplicationRecord
  belongs_to :land_parcel
  validates :amount, :start_date, presence: true
  validate :start_date_cannot_be_in_the_past, :amount_limit

  private

  def start_date_cannot_be_in_the_past
    return unless start_date.present? && start_date < Time.zone.today

    errors.add(:start_date, "can't be in the past")
  end

  def amount_limit
    return if amount.present? && amount < 1_000_000_000

    errors.add(:amount, 'is too large')
  end
end
