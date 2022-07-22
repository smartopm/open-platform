# frozen_string_literal: true

module Types
  # Message Type
  class MessageType < Types::BaseObject
    field :id, ID, null: false
    field :user, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:user)
    field :sender, Types::UserType, null: false, resolve: Resolvers::BatchResolver.load(:sender)
    field :user_id, ID, null: false
    field :sender_id, ID, null: false
    field :receiver, String, null: false
    field :status, String, null: false
    field :category, String, null: true
    field :message, String, null: true
    field :is_read, Boolean, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
    field :read_at, GraphQL::Types::ISO8601DateTime, null: true
  end
end
