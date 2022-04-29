# frozen_string_literal: true

module Types
  # CommentsByStatusType
  class CommentsByStatusType < Types::BaseObject
    field :sent, [Types::NoteCommentType], null: false
    field :received, [Types::NoteCommentType], null: false
    field :resolved, [Types::NoteCommentType], null: false
    field :others, [Types::NoteCommentType], null: false
  end
end
