# frozen_string_literal: true

module ActionFlows
  module Events
    # User Login Event to handle related action
    class LeadUpdateEvent < ActionFlows::EventPop
      EVENT_TYPE = 'lead_update'
      EVENT_DESC = 'Lead Update'

      def self.event_metadata
        {
          'Lead' => obj_data['Lead'],
        }
      end

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def preload_data(event_log)
        lead = event_log.ref_type.constantize.find(event_log.ref_id)
        load_data(
          { 'Lead' => lead },
          'name' => lead.name,
          'email' => lead.email,
          'temperature' => lead.lead_temperature,
          'source' => lead.lead_source,
          'owner' => lead.lead_owner,
          'type' => lead.lead_type,
          'previous_status' => event_log.data['previous_status'],
          'current_status' => event_log.data['current_status'],
          'has_status_changed' => event_log.data['has_status_changed'],
        )
      end
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/AbcSize
    end
  end
end
