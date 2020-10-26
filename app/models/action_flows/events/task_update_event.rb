# frozen_string_literal: true

module ActionFlows
  module Events
    # Task Update Event to handle related action
    class TaskUpdateEvent < ActionFlows::EventPop
      EVENT_TYPE = 'task_create'
      EVENT_DESC = 'Note Update'

      # To be fetched dynamically later : Saurabh
      def rule
        {
          "if": [
            { "===": [{ "var": 'note_subject' }, 'task_update'] },
            ['email', { "var": 'note_assignees' }],
            [],
          ],
        }.freeze
      end

      def data_rule
        {
          "if": [
            { "===": [{ "var": 'note_subject' }, 'task_update'] },
            ['task_name', { "var": 'note_body' }, 'url', { "var": 'note_id' }],
            [],
          ],
        }.freeze
      end

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
        assignees_email = note.assignees.map {|d| d.email }.join(',')
        load_data({'Note' => note},{'assignees_emails' => assignees_email})
      end

      def setup_data(note)
        load_data('Note' => note)
      end

      def url_format(id)
        "https://#{ENV['HOST']}/todo/#{id}"
      end
    end
  end
end
