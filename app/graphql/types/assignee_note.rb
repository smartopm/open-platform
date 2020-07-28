# frozen_string_literal: true

module Types
    # AssigneeNote
    class AssigneeNote < Types::BaseObject
      field :id, ID, null: false
      field :note_id, ID, null: false
      field :user_id, ID, null: false
      field :created_at, GraphQL::Types::ISO8601DateTime, null: false
      field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
    end
  end
  