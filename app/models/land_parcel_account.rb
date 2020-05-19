# frozen_string_literal: true

# Land Parcel account maps account and parcel.
class LandParcelAccount < ApplicationRecord
  belongs_to :land_parcel, dependent: :destroy
  belongs_to :account, dependent: :destroy
end
