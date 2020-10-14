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

        note.reminder_time = hour.send(:hour).from_now
        raise GraphQL::ExecutionError, note.errors.full_messages unless note.save

        { note: note }
      end

      def authorized?(_vals)
        return true if context[:current_user]&.admin?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
