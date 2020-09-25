# frozen_string_literal: true

module Mutations
  module Note

    class NoteCommentCreate < BaseMutation
      argument :note_id, ID, required: true
      argument :body, String, required: true

      field :note_comment, Types::NoteCommentType, null: true

      def resolve(vals)
        comment = context[:current_user].note_comments.new(vals)
        raise GraphQL::ExecutionError, note.errors.full_messages unless comment.save

        comment.record_note_history(context[:current_user], { id: comment.reload.id })
        { note_comment: comment }
      end

      def authorized?(_vals)
        return true if context[:current_user].present?

        raise GraphQL::ExecutionError, 'Unauthorized'
      end
    end
  end
end
