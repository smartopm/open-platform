# frozen_string_literal: true

# Land Parcel account maps account and parcel.
class LandParcelAccount < ApplicationRecord
  belongs_to :land_parcel
  belongs_to :account
end
