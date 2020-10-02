# frozen_string_literal: true

module Mutations
  module Note
    # Create Note Comments
    class NoteCommentDelete < BaseMutation
      argument :comment_id, ID, required: true

      field :comment_delete, GraphQL::Types::Boolean, null: false

      def resolve(vals)
        comment = context[:current_user].note_comments.update(status: 'deleted')
        
        raise GraphQL::ExecutionError, note.errors.full_messages unless comment.save

        comment.record_note_history(context[:current_user])
        { note_comment: comment }
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
