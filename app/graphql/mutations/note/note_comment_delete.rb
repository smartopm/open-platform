# frozen_string_literal: true

module Mutations
  module Note
    # Create Note Comments
    class NoteCommentDelete < BaseMutation
      argument :id, ID, required: true

      field :comment_delete, GraphQL::Types::Boolean, null: false

      def resolve(id:)
        comment = Comments::NoteComment.find(id)
        raise_comment_not_found_error(comment)

        updates_hash = { status: [comment.status, 'deleted'] }
        if comment.update(status: 'deleted')
          comment.record_note_history(context[:current_user], updates_hash)
          return { comment_delete: comment }
        end

        raise GraphQL::ExecutionError, comment.errors.full_messages
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if ::Policy::ApplicationPolicy.new(
          context[:current_user], nil
        ).permission?(
          admin: true,
          module: :note,
          permission: :can_delete_note_comment,
        )

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if comment does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_comment_not_found_error(comment)
        return if comment

        raise GraphQL::ExecutionError, I18n.t('errors.comment.not_found')
      end
    end
  end
end
