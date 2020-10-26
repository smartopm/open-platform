# frozen_string_literal: true

module ActionFlows
  module Events
    # Task Update Event to handle related action
    class NoteCommentCreateEvent < ActionFlows::EventPop
      EVENT_TYPE = 'note_comment_create'
      EVENT_DESC = 'Note Comment Create'

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

      def preload_data(eventlog)
        note_comment = eventlog.ref_type.constantize.find eventlog.ref_id
        assignees_email = note_comment.note.assignees.map(&:email).join(',')
        load_data({ 'NoteComment' => note_comment }, 'assignees_emails' => assignees_email)
      end

      def url_format(note_id)
        "https://#{ENV['HOST']}/todo/#{note_id}"
      end
    end
  end
end
