# frozen_string_literal: true

module Types
  # ProcessCommentsByStatusType
  class ProcessReplyCommentsType < Types::BaseObject
    field :sent, [Types::NoteCommentType], null: true
    field :received, [Types::NoteCommentType], null: true
    field :resolved, [Types::NoteCommentType], null: true
  end
end
