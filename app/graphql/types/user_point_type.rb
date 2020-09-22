# frozen_string_literal: true

module Types
  # UserPointType
  class UserPointType < Types::BaseObject
    field :id, ID, null: false
    field :user_id, ID, null: false
    field :article, Integer, null: false
    field :comment, Integer, null: false
    field :referral, Integer, null: false
    field :login, Integer, null: false
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :updated_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
