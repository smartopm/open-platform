# frozen_string_literal: true

require 'customer_journey_report'

# Substatus Log
class SubstatusLog < ApplicationRecord
  belongs_to :community
  belongs_to :user

  def self.create_time_distribution_report(data)
    CustomerJourneyReport.generate_substatus_time_distribution(data)
  end
end
