# frozen_string_literal: true

module Mutations
  module Note
    # Create a new request/pending member
    class NoteUpdate < BaseMutation
      argument :id, ID, required: true
      argument :body, String, required: false
      argument :flagged, Boolean, required: false
      argument :completed, Boolean, required: false
      argument :due_date, String, required: false

      field :note, Types::NoteType, null: true

      def resolve(id:, **attributes)
        note = context[:site_community].notes.find(id)
        raise GraphQL::ExecutionError, 'NotFound' unless note

        # TODO: @olivier Find a way of adding an updated_at datetime
        return { note: note } if note.update!(attributes)

        raise GraphQL::ExecutionError, note.errors.full_messages
      end

      # TODO: Better auth here
      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user&.admin?

        true
      end
    end
  end
end
