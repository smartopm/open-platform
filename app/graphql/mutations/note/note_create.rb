# frozen_string_literal: true

module Mutations
  module Note
    # Create a new request/pending member
    class NoteCreate < BaseMutation
      argument :user_id, ID, required: false
      argument :body, String, required: true
      argument :category, String, required: false
      argument :flagged, Boolean, required: false
      argument :completed, Boolean, required: false
      argument :due_date, String, required: false

      field :note, Types::NoteType, null: true

      def resolve(vals)
        note = context[:current_user].generate_note(vals)
        raise GraphQL::ExecutionError, note.errors.full_messages unless note.persisted?

        note.record_note_history(context[:current_user], id: note.reload.id)
        { note: note }
      end

      # TODO: Better auth here
      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
