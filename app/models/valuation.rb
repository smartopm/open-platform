# frozen_string_literal: true

# Valuation, describe valuations on land parcels
class Valuation < ApplicationRecord
  belongs_to :land_parcel
  validates :amount, :start_date, presence: true
  validate :amount_limit

  def self.latest
    where('start_date <= ?', Time.zone.now).order(start_date: :desc).first
  end

  private

  def amount_limit
    return if amount.present? && amount < 1_000_000_000

    errors.add(:amount, 'is too large')
  end
end
