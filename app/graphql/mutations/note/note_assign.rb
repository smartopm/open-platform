# frozen_string_literal: true

module Mutations
  module Note
    # Assign and Unassign a note ==> user
    class NoteAssign < BaseMutation
      argument :note_id, ID, required: true
      argument :user_id, ID, required: true

      field :assignee_note, String, null: true

      def resolve(note_id:, user_id:)
        note = context[:site_community].notes.find(note_id).assign_or_unassign_user(user_id)
        return { assignee_note: 'success' } if note.errors.blank?

        raise GraphQL::ExecutionError, note.errors.full_messages
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
