# frozen_string_literal: true

module Mutations
  module Note
    # Create Note Comments
    class NoteCommentDelete < BaseMutation
      argument :id, ID, required: true

      field :comment_delete, GraphQL::Types::Boolean, null: false

      def resolve(id:)
        comment = NoteComment.find(id)
        raise GraphQL::ExecutionError, 'Comment Not Found' unless comment

        updates_hash = { status: [comment.status, 'deleted'] }
        if comment.update(status: 'deleted')
          comment.record_note_history(context[:current_user], updates_hash)
          return { comment_delete: comment }
        end

        raise GraphQL::ExecutionError, comment.errors.full_messages
      end

      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
