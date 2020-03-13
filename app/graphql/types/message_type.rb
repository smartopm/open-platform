# frozen_string_literal: true

module Types
  # Message Type
  class MessageType < Types::BaseObject
    field :id, ID, null: false
    field :sender, Types::UserType, null: false
    field :to, Boolean, null: false
    field :sms_content, String, null: true
    field :created_at, GraphQL::Types::ISO8601DateTime, null: false
  end
end
