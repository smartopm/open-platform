# frozen_string_literal: true

module Mutations
  module Note
    # Create a new request/pending member
    class NoteUpdate < BaseMutation
      argument :id, ID, required: true
      argument :body, String, required: true

      field :note, Types::NoteType, null: true

      def resolve(vals)
        note = ::Note.find(vals.delete(:id))
        raise GraphQL::ExecutionError, 'NotFound' unless note

        return { note: note } if note.update(body: vals[:body])

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
