# frozen_string_literal: true

module ActionFlows
  module Events
    # Task Update Event to handle related action
    class TaskUpdateEvent < ActionFlows::EventPop
      EVENT_TYPE = 'note_update'
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

      def initialize
        super
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
