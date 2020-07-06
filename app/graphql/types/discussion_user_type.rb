# frozen_string_literal: true

module Types
  # DiscussionUserType
  class DiscussionUserType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :discussion_id, ID, null: false
    field :user, Types::UserType, null: false
    field :discussion, Types::UserType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
