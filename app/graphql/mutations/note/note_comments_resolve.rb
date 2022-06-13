# frozen_string_literal: true

module Mutations
  module Note
    # Resolve Note Comments
    class NoteCommentsResolve < BaseMutation
      argument :note_id, ID, required: true
      argument :grouping_id, ID, required: true

      field :success, Boolean, null: true

      def resolve(vals)
        note = Notes::Note.find_by(id: vals[:note_id])
        raise GraphQL::ExecutionError, I18n.t('errors.note.task_not_found') unless note

        comment_pending_reply = note.note_comments.find_by(
          grouping_id: vals[:grouping_id],
          replied_at: nil,
        )

        unless comment_pending_reply.update(replied_at: Time.zone.now)
          raise GraphQL::ExecutionError, comment_pending_reply.errors.full_messages
        end

        { success: true }
      end

      def authorized?(_vals)
        return true if permitted?(module: :note, permission: :can_resolve_note_comments)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
