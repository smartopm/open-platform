# frozen_string_literal: true

require 'host_env'

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

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      def preload_data(eventlog)
        note_comment = eventlog.ref_type.constantize.unscoped.find eventlog.ref_id
        assignees_email = note_comment.note.assignees.map(&:email).join(',')
        load_data(
          { 'NoteComment' => note_comment },
          'assignees_emails' => assignees_email,
          'url' => "https://#{HostEnv.base_url(eventlog.community)}/tasks/#{note_comment.note.id}",
        )
      end
    end
  end
end
