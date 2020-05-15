class Account < ApplicationRecord
  belongs_to :community
  belongs_to :user
  has_and_belongs_to_many :land_parcels, join_table: :land_parcel_accounts
end
