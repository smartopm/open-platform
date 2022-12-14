# frozen_string_literal: true

require 'customer_journey_report'

module Logs
  # Substatus Log
  class SubstatusLog < ApplicationRecord
    belongs_to :community
    belongs_to :user, class_name: 'Users::User'
    belongs_to :updated_by, class_name: 'Users::User'

    default_scope { order(created_at: :desc) }

    scope :previous_log, lambda { |created_at|
      where(arel_table[:created_at].lt(created_at)).order(created_at: :asc).limit(1)
    }

    def self.create_time_distribution_report(community_id)
      CustomerJourneyReport.generate_substatus_time_distribution(community_id)
    end
  end
end
