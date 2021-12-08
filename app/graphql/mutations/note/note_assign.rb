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
        init_assignee = init_assignee_name(note)
        note.assign_or_unassign_user(user_id)
        raise GraphQL::ExecutionError, note.errors.full_messages if note.errors.present?

        record_history(init_assignee, note)
      end

      def init_assignee_name(note)
        note.assignee_notes.includes(:user).pluck(:name).join(', ')
      end

      def record_history(init_user_names, note)
        updated_user_names = note.reload.assignee_notes.includes(:user).pluck(:name).join(', ')
        updates_hash = { assign: [init_user_names, updated_user_names] }
        if updated_user_names.eql?(init_user_names)
          return { assignee_note: I18n.t('response.failed') }
        end

        note.record_note_history(context[:current_user], updates_hash)
        { assignee_note: I18n.t('response.success') }
      end

      # TODO: Better auth here
      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if permitted?(module: :note, permission: :can_assign_note)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
