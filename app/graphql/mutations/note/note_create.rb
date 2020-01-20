# frozen_string_literal: true

module Mutations
  module Note
    # Create a new request/pending member
    class NoteCreate < BaseMutation
      argument :user_id, ID, required: true
      argument :body, String, required: true
      argument :flagged, Boolean, required: false

      field :note, Types::NoteType, null: true

      def resolve(vals)
        note = context[:current_user].notes.new(vals)
        note.author_id = context[:current_user].id
        note.save

        return { note: note } if note.persisted?

        raise GraphQL::ExecutionError, note.errors.full_messages
      end

      # TODO: Better auth here
      def authorized?(_vals)
        current_user = context[:current_user]
        raise GraphQL::ExecutionError, 'Unauthorized' unless current_user

        true
      end
    end
  end
end
