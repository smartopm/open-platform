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
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
