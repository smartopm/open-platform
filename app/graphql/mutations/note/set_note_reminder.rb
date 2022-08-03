# frozen_string_literal: true

module Mutations
  module Note
    # Set note reminder
    class SetNoteReminder < BaseMutation
      argument :note_id, ID, required: true
      argument :hour, Int, required: true

      field :note, Types::NoteType, null: false

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(note_id:, hour:)
        user = context[:current_user]
        assigned_note = user.assignee_notes.find_by(note: note_id)

        # Reason: Admin is not an assignee
        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized') unless assigned_note

        time = hour.send(:hour)

        ActiveRecord::Base.transaction do
          assigned_note.reminder_time = time.from_now
          unless assigned_note.save
            raise GraphQL::ExecutionError, assigned_note
              .errors.full_messages
          end

          job = TaskReminderJob.set(wait: time).perform_later('manual', assigned_note)
          TaskReminderUpdateJob.perform_later(assigned_note, job.provider_job_id)
        end

        note = assigned_note.note
        { note: note }
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :note, permission: :can_set_note_reminder)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
