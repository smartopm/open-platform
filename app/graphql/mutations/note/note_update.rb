# frozen_string_literal: true

module Mutations
  module Note
    # Create a new request/pending member
    class NoteUpdate < BaseMutation
      argument :user_id, ID, required: false
      argument :id, ID, required: true
      argument :body, String, required: false
      argument :category, String, required: false
      argument :description, String, required: false
      argument :flagged, Boolean, required: false
      argument :completed, Boolean, required: false
      argument :due_date, String, required: false
      argument :parent_note_id, ID, required: false
      argument :document_blob_id, String, required: false

      field :note, Types::NoteType, null: true

      # rubocop:disable Metrics/AbcSize
      # rubocop:disable Metrics/MethodLength
      def resolve(id:, **attributes)
        note = context[:site_community].notes.find(id)
        raise_note_not_found_error(note)

        update_attributes = attributes.except(:document_blob_id)
        unless note.update!(update_attributes)
          raise GraphQL::ExecutionError, note.errors.full_messages
        end

        if attributes[:document_blob_id]
          attach_document(note, attributes[:document_blob_id])
          context[:current_user].note_documents.attach(attributes[:document_blob_id])
        end

        updates_hash = record_attributes(update_attributes, note)
        note.record_note_history(context[:current_user], updates_hash)
        { note: note }
      end
      # rubocop:enable Metrics/AbcSize
      # rubocop:enable Metrics/MethodLength

      def record_attributes(attributes, note)
        updates_hash = {}
        attributes.each do |key, value|
          if key.eql?(:user_id)
            value = context[:site_community].users.find(value)&.name
            updates_hash[:user_id] = [note.user.name, value]
            next
          end
          updates_hash[key] = [note.send(key), value]
        end
        updates_hash
      end

      def attach_document(note, document_blob_id)
        note.documents.attach(document_blob_id)
      rescue ActiveSupport::MessageVerifier::InvalidSignature, ActiveStorage::Error => e
        raise GraphQL::ExecutionError, e.message
      end

      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if ::Policy::ApplicationPolicy.new(
          context[:current_user], nil
        ).permission?(
          module: :note, permission: :can_update_note,
        ) || context[:current_user]&.site_manager?

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end

      private

      # Raises GraphQL execution error if note does not exist.
      #
      # @return [GraphQL::ExecutionError]
      def raise_note_not_found_error(note)
        return if note

        raise GraphQL::ExecutionError, I18n.t('errors.not_found')
      end
    end
  end
end
