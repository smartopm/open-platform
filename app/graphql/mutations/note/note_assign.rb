# frozen_string_literal: true

module Mutations
  module Note
    # Assign and Unassign a note ==> user
    class NoteAssign < BaseMutation
      argument :note_id, ID, required: true
      argument :user_id, ID, required: true

      field :assignee_note, String, null: true

      def resolve(note_id:, user_id:)
        note = context[:site_community].notes.find(note_id)
        init_assignee = note.assignee_notes.pluck(:user_id).join(',')
        note.assign_or_unassign_user(user_id)
        raise GraphQL::ExecutionError, note.errors.full_messages if note.errors.present?

        record_history(init_assignee, note)
      end

      def record_history(init_user_ids, note)
        updated_user_ids = note.reload.assignee_notes.pluck(:user_id).join(',')
        updates_hash = { user_id: [init_user_ids, updated_user_ids] }
        return { assignee_note: 'failed' } if updated_user_ids.eql?(init_user_ids)

        note.record_note_history(context[:current_user], updates_hash)
        { assignee_note: 'success' }
      end

      # if key.eql?(:user_id)
      #   value = context[:site_community].users.find(value)&.name
      #   updates_hash[:user_id] = [note.user.name, value]
      #   next
      # end

      # TODO: Better auth here
      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
