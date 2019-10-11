# frozen_string_literal: true

module Types
  # UserType
  class UserType < Types::BaseObject
    field :id, ID, null: false
    field :community, Types::CommunityType, null: false
    field :email, String, null: true
    field :name, String, null: false
    field :image_url, String, null: true
    field :user_type, String, null: true
    field :vehicle, String, null: true
    field :request_reason, String, null: true
    field :request_note, String, null: true
    field :role_name, String, null: true
    field :state, String, null: true
    field :expires_at, GraphQL::Types::ISO8601DateTime, null: true
    field :last_activity_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
