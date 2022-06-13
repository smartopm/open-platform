# frozen_string_literal: true

module Payments
  # Manages amount allocated to Plan.
  class PlanPayment < ApplicationRecord
    include SearchCop

    enum status: { paid: 0, cancelled: 1 }

    belongs_to :user_transaction, class_name: 'Payments::Transaction', foreign_key: :transaction_id,
                                  inverse_of: :plan_payments
    belongs_to :user, class_name: 'Users::User'
    belongs_to :community
    belongs_to :payment_plan, class_name: 'Properties::PaymentPlan'
    has_one :land_parcel, class_name: 'Properties::LandParcel', through: :payment_plan

    before_create :add_prefix_for_manual_receipt_number, if: -> { manual_receipt_number.present? }

    validates :amount, numericality: { greater_than: 0 }
    validate :validate_manual_receipt_number
    has_paper_trail

    search_scope :search do
      attributes :created_at, :automated_receipt_number, :manual_receipt_number
      attributes user: ['user.name']
      attributes phone_number: ['user.phone_number']
      attributes email: ['user.email']
      attributes amount: ['user_transaction.amount']
      attributes source: ['user_transaction.source']
      attributes parcel_number: ['land_parcel.parcel_number']
      attributes parcel_type: ['land_parcel.parcel_type']
      attributes ext_ref_id: ['user.ext_ref_id']
    end

    search_scope :search_by_numbers do
      attributes :automated_receipt_number, :manual_receipt_number
      attributes amount: ['user_transaction.amount']
      attributes phone_number: ['user.phone_number']
      attributes ext_ref_id: ['user.ext_ref_id']
      attributes parcel_number: ['land_parcel.parcel_number']
    end

    scope :created_at_lteq, lambda { |created_at|
      where(PlanPayment.arel_table[:created_at].lteq(created_at))
    }

    scope :exluding_general_payments, lambda {
      joins(:payment_plan).where.not(payment_plans: { status: %i[deleted general] })
    }

    # Returns receipt number
    #
    # @return [String]
    def receipt_number
      manual_receipt_number.presence || automated_receipt_number
    end

    # Return manual receipt number without the prefix MI
    #
    # @return [String]
    def manual_receipt_number_without_prefix
      manual_receipt_number&.split('MI')
    end

    private

    def add_prefix_for_manual_receipt_number
      manual_receipt_number.prepend('MI')
    end

    def validate_manual_receipt_number
      if PlanPayment.exists?(
        community_id: community_id,
        manual_receipt_number: "MI#{receipt_number}",
        status: :paid,
      )
        errors.add(:base, I18n.t('errors.receipt_number.already_exists'))
      end
    end
  end
end
