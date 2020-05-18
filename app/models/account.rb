# frozen_string_literal: true

# Account allows users to have multiple parcels and parcels to belong to
# multiple users.
class Account < ApplicationRecord
  belongs_to :community
  belongs_to :user
  has_many :land_parcels, through: :land_parcel_accounts
end
