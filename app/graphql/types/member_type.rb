# frozen_string_literal: true

module Types
  # MemberType
  class MemberType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false
    field :member_type, String, null: true
    field :expires_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
