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
        note = context[:site_community].notes.find(note_id)

        raise GraphQL::ExecutionError, 'Unauthorized' if user.tasks.where(id: note.id).blank?

        time = hour.send(:hour)

        ActiveRecord::Base.transaction do
          note.reminder_time = time.from_now
          raise GraphQL::ExecutionError, note.errors.full_messages unless note.save

          job = TaskReminderJob.set(wait: time).perform_later(note_id, user.id)
          TaskReminderUpdateJob.perform_now(note_id, job.provider_job_id)
        end

        { note: note }
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
