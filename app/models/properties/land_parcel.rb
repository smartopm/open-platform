# frozen_string_literal: true

module Properties
  # Land Parcel, describe the land partitions.
  class LandParcel < ApplicationRecord
    include SearchCop

    belongs_to :community
    has_many :land_parcel_accounts, dependent: :destroy
    has_many :accounts, through: :land_parcel_accounts
    has_many :valuations, -> { order(start_date: :asc) },
             dependent: :destroy, inverse_of: :land_parcel
    has_many :payment_plans, dependent: :destroy
    has_many_attached :images

    VALID_OBJECT_TYPES = %w[land house poi].freeze

    validates :parcel_number, uniqueness: true
    default_scope { where(status: :active).order(created_at: :desc) }
    validates :object_type, inclusion: { in: VALID_OBJECT_TYPES, allow_nil: true }

    search_scope :search do
      attributes :parcel_number, :address1, :address2, :parcel_type
      attributes owner: ['accounts.full_name', 'accounts.address1', 'accounts.address2']
    end
    enum status: { active: 0, deleted: 1, general: 2 }
  end
end
