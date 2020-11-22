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
        raise GraphQL::ExecutionError, 'Unauthorized' unless assigned_note

        time = hour.send(:hour)

        ActiveRecord::Base.transaction do
          assigned_note.reminder_time = time.from_now
          unless assigned_note.save
            raise GraphQL::ExecutionError, assigned_note
              .errors.full_messages
          end

          job = TaskReminderJob.set(wait: time).perform_later(assigned_note)
          TaskReminderUpdateJob.perform_later(assigned_note, job.provider_job_id)
        end

        # TODO: remove dead code note_assigned? method from user model and test
        note = assigned_note.note
        { note: note }
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
