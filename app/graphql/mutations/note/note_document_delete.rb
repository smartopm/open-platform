# frozen_string_literal: true

module Mutations
  module Note
    # Delete Note Document
    class NoteDocumentDelete < BaseMutation
      argument :document_id, ID, required: true

      field :document_deleted, GraphQL::Types::Boolean, null: false

      def resolve(document_id:)
        document = ActiveStorage::Attachment.find_by(id: document_id)
        return { document_deleted: true } if document.update(status: 1)

        raise GraphQL::ExecutionError, document.errors.full_messages&.join(', ')
      end

      def authorized?(_vals)
        return true if permitted?(module: :note, permission: :can_delete_note_document)

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
