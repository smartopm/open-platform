# frozen_string_literal: true

require 'host_env'

module ActionFlows
  module Events
    # Task Create Event to handle related action
    class TaskCreateEvent < ActionFlows::EventPop
      EVENT_TYPE = 'task_create'
      EVENT_DESC = 'Task Create'

      def self.event_metadata
        {
          'TaskCreate' => obj_data['TaskCreate'],
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
        note = eventlog.ref_type.constantize.find eventlog.ref_id
        user_type = note.user.user_type
        community_id = note.community_id
        load_data(
          { 'TaskCreate' => note },
          'user_type' => user_type,
          'community_id' => community_id,
          'url' => "https://#{HostEnv.base_url(eventlog.community)}/tasks/#{note.id}",
        )
      end
    end
  end
end
