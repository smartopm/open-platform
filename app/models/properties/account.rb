# frozen_string_literal: true

module Properties
  # Account allows users to have multiple parcels and parcels to belong to
  # multiple users.
  class Account < ApplicationRecord
    belongs_to :community
    belongs_to :user, class_name: 'Users::User'
    has_many :land_parcel_accounts, dependent: :destroy
    has_many :land_parcels, through: :land_parcel_accounts
  end
end
