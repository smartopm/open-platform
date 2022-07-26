# frozen_string_literal: true

module Types
  # NoteCommentType
  class NoteHistoryType < Types::BaseObject
    field :id, ID, null: false
    field :attr_changed, String, null: true
    field :initial_value, String, null: true
    field :updated_value, String, null: true
    field :action, String, null: true
    field :note_entity_id, ID, null: true
    field :note_entity_type, String, null: true
    field :note_id, ID, null: false
    field :user_id, ID, null: false
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
