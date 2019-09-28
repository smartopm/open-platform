# frozen_string_literal: true

module Types
  # MemberType
  class MemberType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :member_type, String, null: true
    field :expires_at, GraphQL::Types::ISO8601DateTime, null: true
    field :community, Types::CommunityType, null: false
    field :last_activity_at, GraphQL::Types::ISO8601DateTime, null: true

    def last_activity_at
      return object.activity_logs.last.created_at if object.activity_logs.present?

      nil
    end
  end
end
