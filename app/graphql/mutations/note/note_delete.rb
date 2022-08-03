# frozen_string_literal: true

module Mutations
  module Note
    # Deletes note
    class NoteDelete < BaseMutation
      argument :id, ID, required: true

      field :success, Boolean, null: false

      def resolve(id:)
        validate_authorization(:note, :can_delete_note)
        note = context[:site_community].notes.find(id)
        check_errors(note)
        return { success: true } if note.update(status: 'deleted')

        raise_error_message(note.errors.full_messages&.join(', '))
      end

      def check_errors(note)
        raise_error_message(I18n.t('errors.unauthorized')) unless user_authorized(note.author_id)

        raise_error_message(I18n.t('errors.note.cannot_delete')) unless note.sub_tasks.count.zero?
      end

      private

      def user_authorized(author_id)
        context[:current_user].user_type.eql?('admin') ||
          context[:current_user].id.eql?(author_id)
      end
    end
  end
end
