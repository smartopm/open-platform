# frozen_string_literal: true

require 'host_env'

module ActionFlows
  module Events
    # Task Assign Event to handle related action
    class TaskAssignEvent < ActionFlows::EventPop
      EVENT_TYPE = 'task_assign'
      EVENT_DESC = 'Task Assign'

      def self.event_metadata
        {
          'TaskAssign' => obj_data['TaskAssign'],
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
        note_assign = eventlog.ref_type.constantize.find eventlog.ref_id
        user_type = note_assign.note.user.user_type
        author_id = note_assign.note.author_id
        body = note_assign.note.body
        load_data(
          { 'TaskAssign' => note_assign },
          'user_type' => user_type,
          'author_id' => author_id,
          'body' => body,
        )
      end
    end
  end
end
