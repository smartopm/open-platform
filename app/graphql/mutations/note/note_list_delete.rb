# frozen_string_literal: true

module Mutations
  module Note
    # Deletes note list
    class NoteListDelete < BaseMutation
      argument :id, ID, required: true

      field :success, Boolean, null: false

      def resolve(id:)
        note_list = context[:site_community].note_lists.find_by(id: id)
        raise_error_message(I18n.t('errors.note.note_list_not_found')) if note_list.nil?

        return { success: true } if note_list.deleted!

        raise_error_message(note_list.errors.full_messages&.join(', '))
      end

      def authorized?(_vals)
        return true if permitted?(module: :note, permission: :can_delete_task_list)

        raise_error_message(I18n.t('errors.unauthorized'))
      end
    end
  end
end
