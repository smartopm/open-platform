# frozen_string_literal: true

module Mutations
  module Note
    # Create Note Comments
    class NoteCommentCreate < BaseMutation
      argument :note_id, ID, required: true
      argument :body, String, required: true
      argument :reply_required, Boolean, required: false
      argument :reply_from_id, ID, required: false
      argument :grouping_id, ID, required: false

      field :note_comment, Types::NoteCommentType, null: true

      # rubocop:disable Metrics/AbcSize
      def resolve(vals)
        comment = context[:current_user].note_comments.new(vals)
        comment.status = 'active'
        raise GraphQL::ExecutionError, note.errors.full_messages unless comment.save

        if comment.grouping_id.nil? && comment.reply_required
          comment.update!(grouping_id: comment.id)
        end

        comment.record_note_history(context[:current_user])
        { note_comment: comment }
      end
      # rubocop:enable Metrics/AbcSize

      def authorized?(_vals)
        return true if permitted?(module: :note, permission: :can_create_note_comment)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
