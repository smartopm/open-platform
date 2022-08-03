# frozen_string_literal: true

module Mutations
  module Note
    # Unset note reminder
    class UnsetNoteReminder < BaseMutation
      argument :note_id, ID, required: true

      field :note, Types::NoteType, null: false

      # rubocop:disable Metrics/MethodLength
      def resolve(note_id:)
        user = context[:current_user]
        assigned_note = user.assignee_notes.find_by(note: note_id)

        # Reason: Admin is not an assignee
        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless assigned_note

        ActiveRecord::Base.transaction do
          assigned_note.reminder_time = nil
          unless assigned_note.save
            raise GraphQL::ExecutionError, assigned_note
              .errors.full_messages
          end

          TaskReminderRemoveJob.perform_later(assigned_note)
        end

        note = assigned_note.note
        { note: note }
      end
      # rubocop:enable Metrics/MethodLength

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :note, permission: :can_set_note_reminder)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
