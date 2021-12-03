# frozen_string_literal: true

module Mutations
  module Note
    # Create Note Comments
    class NoteCommentCreate < BaseMutation
      argument :note_id, ID, required: true
      argument :body, String, required: true

      field :note_comment, Types::NoteCommentType, null: true

      def resolve(vals)
        comment = context[:current_user].note_comments.new(vals)
        comment.status = 'active'
        raise GraphQL::ExecutionError, note.errors.full_messages unless comment.save

        comment.record_note_history(context[:current_user])
        { note_comment: comment }
      end

      def authorized?(_vals)
        return true if permitted?(module: :note, permission: :can_create_note_comment)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
