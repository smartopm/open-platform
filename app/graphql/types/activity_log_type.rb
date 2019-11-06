# frozen_string_literal: true

module Types
  # ActivityLogType
  class ActivityLogType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :user, Types::UserType, null: false
    field :reporting_user, Types::UserType, null: false
    field :community, Types::CommunityType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :note, String, null: true
  end
end
