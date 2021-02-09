# frozen_string_literal: true

require 'host_env'

module ActionFlows
  module Events
    # Task Update Event to handle related action
    class InvoiceChangeEvent < ActionFlows::EventPop
      EVENT_TYPE = 'invoice_change'
      EVENT_DESC = 'Invoice Update and Create'

      def self.event_metadata
        {
          'Invoice' => obj_data['Invoice'],
        }
      end

      def self.event_metadata_list
        {
          #  TaskUpdateEvent.event_metadata.values.map{|v| v.values }
        }
      end

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      def preload_data(eventlog)
        invoice = eventlog.ref_type.constantize.find eventlog.ref_id
        load_data(
          { 'Invoice' => invoice },
          'amount' => invoice.amount,
          'user_name' => invoice.user.name,
          'user_email' => invoice.user.email,
          'due_date' => invoice.due_date,
          'previous_status' => status_changes(eventlog).first,
          'current_status' => status_changes(eventlog).second,
        )
      end

      def status_changes(eventlog)
        return if eventlog.data.nil?

        [eventlog.data['from_status'], eventlog.data['to_status']]
      end
    end
  end
end
