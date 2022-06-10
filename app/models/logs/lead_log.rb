# frozen_string_literal: true

module Logs
  # Lead logs
  class LeadLog < ApplicationRecord
    belongs_to :community
    belongs_to :user, class_name: 'Users::User'
    belongs_to :acting_user, class_name: 'Users::User'

    scope :ordered, -> { order(created_at: :desc) }

    enum log_type: { event: 0, meeting: 1, signed_deal: 2,
                     lead_status: 3, investment: 4, deal_details: 5 }

    validates :deal_size, :investment_target,
              presence: true,
              numericality: { greater_than_or_equal_to: 0 },
              if: -> { log_type.eql?('deal_details') }
    validates :amount,
              presence: true,
              numericality: { greater_than_or_equal_to: 0 },
              if: -> { log_type.eql?('investment') }
  end
end
