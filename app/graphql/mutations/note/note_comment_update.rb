# frozen_string_literal: true

module Mutations
  module Note
    # Update Note Comments attributes
    class NoteCommentUpdate < BaseMutation
      argument :id, ID, required: true
      argument :body, String, required: true

      field :note_comment, Types::NoteCommentType, null: true

      def resolve(id:, body:)
        comment = NoteComment.find(id)
        raise_comment_not_found_error(comment)

        return { note_comment: comment } if comment.body.eql?(body)

        updates_hash = { body: [comment.body, body] }
        if comment.update(body: body)
          comment.record_note_history(context[:current_user], updates_hash)
          return { note_comment: comment }
        end

        raise GraphQL::ExecutionError, comment.errors.full_messages
      end

      # Verifies if current user is present or not.
      def authorized?(_vals)
        return true if context[:current_user].present?

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
