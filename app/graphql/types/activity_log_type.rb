# frozen_string_literal: true

module Types
  # ActivityLogType
  class ActivityLogType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: true
    field :user, Types::UserType, null: true
    field :reporting_user, Types::UserType, null: true
    field :community, Types::CommunityType, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :note, String, null: true
  end
end
