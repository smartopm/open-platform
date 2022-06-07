# frozen_string_literal: true

module Types
  # NoteCommentType
  class NoteCommentType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :note, Types::NoteType, null: false
    field :user_id, ID, null: false
    field :note_id, ID, null: false
    field :body, String, null: true
    field :replied_at, GraphQL::Types::ISO8601DateTime, null: true
    field :reply_from, Types::UserType, null: true
    field :reply_required, Boolean, null: false
    field :grouping_id, ID, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    field :tagged_documents, [ID, { null: true }], null: true
  end
end
