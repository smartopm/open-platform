# frozen_string_literal: true

module Types
  # NoteType
  class NoteType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :owner, Types::UserType, null: false
    field :body, String, null: true
    field :flagged, Boolean, null: true
    field :completed, Boolean, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
