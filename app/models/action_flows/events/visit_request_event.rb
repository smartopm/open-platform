# frozen_string_literal: true

require 'host_env'

module ActionFlows
  module Events
    # Task Update Event to handle related action
    class VisitRequestEvent < ActionFlows::EventPop
      EVENT_TYPE = 'visit_request'
      EVENT_DESC = 'Visit Request'

      def self.event_metadata
        {
          'VisitRequest' => obj_data['VisitRequest'],
        }
      end

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      def preload_data(eventlog)
        entry_request = eventlog.ref_type.constantize.find eventlog.ref_id
        load_data(
          { 'VisitRequest' => entry_request },
          'reason' => entry_request.reason,
          'start_time' => entry_request.start_time,
          'end_time:' => entry_request.end_time,
          'visitor' => entry_request.name,
        )
      end
    end
  end
end
