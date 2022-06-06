# frozen_string_literal: true

module Mutations
  module Note
    # Update Note Comments attributes
    class NoteCommentUpdate < BaseMutation
      argument :id, ID, required: true
      argument :body, String, required: true
      argument :tagged_documents, [ID, { null: true }], required: false

      field :note_comment, Types::NoteCommentType, null: true

      def resolve(id:, body:, tagged_documents:)
        comment = Comments::NoteComment.find_by(id: id)
        return { note_comment: comment } if comment.body.eql?(body)

        updates_hash = { body: [comment.body, body] }
        if comment.update(body: body, tagged_documents: tagged_documents)
          comment.record_note_history(context[:current_user], updates_hash)
          return { note_comment: comment }
        end

        raise GraphQL::ExecutionError, comment.errors.full_messages
      end

      # Verifies if current user is present or not.
      def authorized?(vals)
        comment = Comments::NoteComment.find_by(id: vals[:id])
        raise_comment_not_found_error(comment)
        return true if permitted?(module: :note, permission: :can_update_note_comment) ||
                       comment.user_id.eql?(context[:current_user]&.id)

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
