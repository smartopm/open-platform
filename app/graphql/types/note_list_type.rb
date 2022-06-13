# frozen_string_literal: true

module Types
  # NoteListType
  class NoteListType < Types::BaseObject
    field :id, ID, null: false
    field :name, String, null: false
    field :process, Types::ProcessType, null: false
    field :community, Types::CommunityType, null: false
  end
end
