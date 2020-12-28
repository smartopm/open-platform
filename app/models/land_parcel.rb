# frozen_string_literal: true

# Land Parcel, describe the land partitions.
class LandParcel < ApplicationRecord
  belongs_to :community
  has_many :land_parcel_accounts, dependent: :destroy
  has_many :accounts, through: :land_parcel_accounts

  validates :parcel_number, uniqueness: true
  default_scope { order('created_at DESC') }
end
