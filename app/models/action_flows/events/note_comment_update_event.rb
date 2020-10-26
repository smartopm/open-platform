# frozen_string_literal: true

module ActionFlows
  module Events
    # Task Update Event to handle related action
    class NoteCommentUpdateEvent < ActionFlows::EventPop
      EVENT_TYPE = 'note_comment_update'
      EVENT_DESC = 'Note Comment Update'

      def self.event_metadata
        {
          'NoteComment' => obj_data['NoteComment'],
        }
      end

      def initialize
        super
      end

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      def setup_data(note_comment)
        load_data('NoteComment' => note_comment)
      end

      def url_format(note_id)
        "https://#{ENV['HOST']}/todo/#{note_id}"
      end
    end
  end
end
