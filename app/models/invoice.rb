# frozen_string_literal: true

# Invoice Record
class Invoice < ApplicationRecord
  belongs_to :land_parcel
  belongs_to :community
  belongs_to :user
  has_many :payments, dependent: :destroy

  enum status: { in_progress: 0, paid: 1, late: 2, cancelled: 3 }
  scope :by_status, ->(status) { where(status: status) if status.present? }
end
