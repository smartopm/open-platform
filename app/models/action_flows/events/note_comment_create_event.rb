# frozen_string_literal: true

require 'host_env'

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

      def self.event_description
        EVENT_DESC
      end

      def self.event_type
        EVENT_TYPE
      end

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def preload_data(eventlog)
        note_comment = eventlog.ref_type.constantize.unscoped.find eventlog.ref_id
        assignees_email = note_comment.note.assignees.excluding_leads.map(&:email).join(',')
        load_data(
          { 'NoteComment' => note_comment },
          'assignees_emails' => assignees_email,
          'url' => "https://#{HostEnv.base_url(eventlog.community)}/tasks/#{note_comment.note.id}",
          'user' => note_comment.user.name,
          'due_at' => (note_comment.note.due_date&.strftime('%Y-%m-%d') ||
                      I18n.t('action_flow.never')),
          'updated_date' => eventlog.created_at.strftime('%Y-%m-%d'),
          'note_body' => note_comment.note.body,
          'new_body' => note_comment.body.truncate_words(5),
        )
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength
    end
  end
end
