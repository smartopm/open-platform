# frozen_string_literal: true

module Mutations
  module Note
    # Create a new request/pending member
    class NoteCreate < BaseMutation
      argument :user_id, ID, required: false
      argument :body, String, required: true
      argument :category, String, required: false
      argument :description, String, required: false
      argument :flagged, Boolean, required: false
      argument :completed, Boolean, required: false
      argument :due_date, String, required: false

      field :note, Types::NoteType, null: true

      def resolve(vals)
        note = context[:current_user].generate_note(vals)
        raise GraphQL::ExecutionError, note.errors.full_messages unless note.persisted?

        note.record_note_history(context[:current_user])
        { note: note }
      end

      # TODO: Better auth here
      # Verifies if current user is admin or not.
      def authorized?(_vals)
        return true if context[:current_user]&.site_manager? ||
                       ::Policy::Note::NotePolicy.new(
                         context[:current_user], nil
                       ).permission?(
                         :can_create_note,
                       )

        raise GraphQL::ExecutionError, I18n.t('errors.unauthorized')
      end
    end
  end
end
