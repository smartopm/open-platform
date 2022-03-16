# frozen_string_literal: true

require 'host_env'

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

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def preload_data(eventlog)
        note = eventlog.ref_type.constantize.find eventlog.ref_id
        assignees_email = note.assignees.excluding_leads.map(&:email).join(',')
        note_version = note.versions.order(:created_at).where(event: 'update').last
        load_data(
          { 'Note' => note },
          'assignees_emails' => assignees_email,
          'url' => "https://#{HostEnv.base_url(eventlog.community)}/tasks/#{note.id}",
          'updated_by' => Users::User.find_by(id: note_version.whodunnit)&.name || 'System',
          'updated_field' => eventlog['data']['updated_field'],
          'updated_date' => eventlog.created_at.strftime('%Y-%m-%d'),
          'new_updated_value' => eventlog['data']['new_value'].to_s&.truncate_words(5),
          'due_at' => (note.due_date&.strftime('%Y-%m-%d') || 'Never'),
        )
      end
      # rubocop:enable Metrics/MethodLength
      # rubocop:enable Metrics/AbcSize
    end
  end
end
