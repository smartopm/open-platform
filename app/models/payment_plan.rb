# frozen_string_literal: true

# PaymentPlan
class PaymentPlan < ApplicationRecord
   belongs_to :user
   belongs_to :land_parcel

   enum status: { active: 0, cancelled: 1 }
   
   default_scope { order(created_at: :desc) }
end
  