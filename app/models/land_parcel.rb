# frozen_string_literal: true

# Land Parcel, describe the land partitions.
class LandParcel < ApplicationRecord
  include SearchCop

  belongs_to :community
  has_many :land_parcel_accounts, dependent: :destroy
  has_many :accounts, through: :land_parcel_accounts
  has_many :valuations, -> { order(start_date: :asc) },
           dependent: :destroy, inverse_of: :land_parcel
  has_one :payment_plan, dependent: :destroy

  validates :parcel_number, uniqueness: true
  default_scope { where.not(deleted_status:  1).order(created_at: :desc) }

  search_scope :search do
    attributes :parcel_number, :address1, :address2, :parcel_type
    attributes owner: ['accounts.full_name', 'accounts.address1', 'accounts.address2']
  end
  enum deleted_status: { not_deleted: 0, deleted: 1 }
end
