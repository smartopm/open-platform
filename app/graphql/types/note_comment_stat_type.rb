# frozen_string_literal: true

module Types
  # NoteCommentStatType
  class NoteCommentStatType < Types::BaseObject
    field :sent, Integer, null: true
    field :received, Integer, null: true
    field :resolved, Integer, null: true
  end
end
