# frozen_string_literal: true

module Mutations
  module Note
    # Set note reminder
    class SetNoteReminder < BaseMutation
      argument :note_id, ID, required: true
      argument :hour, Int, required: true

      field :note, Types::NoteType, null: false

      def resolve(note_id:, hour:)
        user = context[:current_user]
        note = ::Note.find(note_id)

        unless user.tasks.where(id: note.id).present?
          raise GraphQL::ExecutionError, 'Unauthorized'
        end

        time = hour.send(:hour)
        note.reminder_time = time.from_now
        raise GraphQL::ExecutionError, note.errors.full_messages unless note.save

        job = TaskReminderJob.set(wait: time).perform_later(note_id, user.id)
        update_reminder_job!(note, job.provider_job_id)

        { note: note }
      end

      def update_reminder_job!(note, new_job_id)
        Sidekiq::ScheduledSet.new.find_job(note.reminder_job_id)&.delete
        note.update!(reminder_job_id: new_job_id)
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
