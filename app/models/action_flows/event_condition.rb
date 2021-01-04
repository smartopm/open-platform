# frozen_string_literal: true

module ActionFlows
  # Class to run JSONLogic with passed rules and data
  class EventCondition
    attr_reader :json_condition, :json_data

    def initialize(json_data)
      @json_data = json_data
    end

    def run_condition(json_condition)
      @json_condition = json_condition
      condition = JSON.parse(@json_condition)
      data = JSON.parse(@json_data)
      return [] if condition.blank? || data.blank?

      JSONLogic.apply(condition, data)
    end
  end
end
