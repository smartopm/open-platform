# frozen_string_literal: true

module Mutations
  module Note
    # Updates note list
    class NoteListUpdate < BaseMutation
      argument :id, ID, required: true
      argument :name, String, required: false

      field :note_list, Types::NoteListType, null: true

      def resolve(vals)
        note_list = context[:site_community].note_lists.find_by(id: vals[:id])
        raise GraphQL::ExecutionError, I18n.t('errors.note.note_list_not_found') if note_list.nil?

        return { note_list: note_list } if note_list.update(name: vals[:name])

        raise GraphQL::ExecutionError, note_list.errors.full_messages&.join(', ')
      end

      def authorized?(_vals)
        return true if permitted?(module: :note, permission: :can_edit_task_list)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
