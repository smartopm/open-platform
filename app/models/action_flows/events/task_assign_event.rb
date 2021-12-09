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

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def preload_data(eventlog)
        note_assign = eventlog.ref_type.constantize.find eventlog.ref_id
        user_type = note_assign.user.user_type
        author_id = note_assign.note.author_id
        body = note_assign.note.body
        note_history = note_assign.note.note_histories.order(:created_at).last
        load_data(
          { 'TaskAssign' => note_assign },
          'user_type' => user_type,
          'author_id' => author_id,
          'body' => body,
          'user_email' => note_assign.user.email,
          'updated_by' => note_history&.user&.name || 'Unknown user',
          'updated_date' => eventlog.created_at.strftime('%Y-%m-%d'),
          'due_at' => (note_assign.note.due_date&.strftime('%Y-%m-%d') || 'Never'),
          'url' => "https://#{HostEnv.base_url(eventlog.community)}/tasks/#{note_assign.note.id}",
        )
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength
    end
  end
end
