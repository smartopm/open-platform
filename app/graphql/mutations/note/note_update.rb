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

      field :note, Types::NoteType, null: true

      def resolve(id:, **attributes)
        note = context[:site_community].notes.find(id)
        raise GraphQL::ExecutionError, 'NotFound' unless note
        # TODO: @olivier Find a way of adding an updated_at datetime
        updates_hash = {}
        attributes.each do |key, value|
          if key.eql?(:user_id)
            value = context[:site_community].users.find(value)&.name
            updates_hash[:user_id] = [note.user.name, value]
            next
          end
          updates_hash[key] = [note.send(key), value]
        end
        raise GraphQL::ExecutionError, note.errors.full_messages unless note.update!(attributes)
        note.record_note_history(context[:current_user], updates_hash)
        { note: note }
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
