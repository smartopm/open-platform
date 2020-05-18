# frozen_string_literal: true

# Land Parcel, describe the land partitions.
class LandParcel < ApplicationRecord
  belongs_to :community
  has_many :accounts, through: :land_parcel_accounts
end
