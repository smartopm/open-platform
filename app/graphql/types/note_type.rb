# frozen_string_literal: true

module Types
  # NoteType
  class NoteType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :owner, Types::UserType, null: false
    field :body, String, null: true
    field :flagged, Boolean, null: true
  end
end
