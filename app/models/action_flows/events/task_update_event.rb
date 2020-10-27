# frozen_string_literal: true

module ActionFlows
  module Events
    # Task Update Event to handle related action
    class TaskUpdateEvent < ActionFlows::EventPop
      EVENT_TYPE = 'task_update'
      EVENT_DESC = 'Note Update'

      def self.event_metadata
        {
          'Note' => obj_data['Note'],
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

      def initialize
        super
      end

      def preload_data(eventlog)
        note = eventlog.ref_type.constantize.find eventlog.ref_id
        assignees_email = note.assignees.map(&:email).join(',')
        load_data({ 'Note' => note }, 'assignees_emails' => assignees_email)
      end

      def url_format(id)
        "https://#{ENV['HOST']}/todo/#{id}"
      end
    end
  end
end
