# frozen_string_literal: true

# PaymentPlan
class PaymentPlan < ApplicationRecord
  belongs_to :user
  belongs_to :land_parcel
  has_many :invoices

  enum status: { active: 0, cancelled: 1, deleted: 2 }
end
