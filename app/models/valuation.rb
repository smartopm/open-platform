class Valuation < ApplicationRecord
  belongs_to :land_parcel
  validates :amount, :start_date, presence: true
end
