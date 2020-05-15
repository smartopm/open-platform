class LandParcel < ApplicationRecord
  belongs_to :community
  has_and_belongs_to_many :accounts, join_table: :land_parcel_accounts
end
