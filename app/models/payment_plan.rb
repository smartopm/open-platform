# frozen_string_literal: true

# PaymentPlan
class PaymentPlan < ApplicationRecord
  belongs_to :user
  belongs_to :land_parcel
  validates :land_parcel_id, uniqueness: true

  enum status: { active: 0, cancelled: 1, deleted: 2 }
end
