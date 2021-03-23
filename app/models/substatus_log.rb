# frozen_string_literal: true

require 'customer_journey_report'

# Substatus Log
class SubstatusLog < ApplicationRecord
  belongs_to :community
  belongs_to :user

  default_scope { order(created_at: :desc) }
  
  scope :next_log, -> (created_at) do
    where(arel_table[:created_at].gt(created_at)).order(created_at: :desc).limit(1)
  end
  scope :previous_log, -> (created_at) do
    where(arel_table[:created_at].lt(created_at)).order(created_at: :asc).limit(1)
  end

  def self.create_time_distribution_report
    CustomerJourneyReport.generate_substatus_time_distribution
  end
end
