# frozen_string_literal: true

# Invoice Record
class Invoice < ApplicationRecord
  belongs_to :land_parcel
  belongs_to :community

  enum status: { in_progress: 0, paid: 1, late: 2, cancelled: 3 }
end
